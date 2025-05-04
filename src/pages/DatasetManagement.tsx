
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { parseCSVData, exportPatientsToCSV } from '../utils/csvHandler';
import { Patient } from '../utils/types';
import { syncPatientsWithSupabase, fetchPatientsFromSupabase, exportPatientsFromSupabase } from '../utils/supabaseClient';
import { Database, FileText, Upload } from 'lucide-react';

const DatasetManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    // Load patients from localStorage and attempt to load from Supabase
    const loadPatients = async () => {
      // First load from localStorage as fallback
      const storedPatients = localStorage.getItem('patients');
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
      
      // Then try to load from Supabase
      try {
        setIsSyncing(true);
        const supabasePatients = await fetchPatientsFromSupabase();
        if (supabasePatients && supabasePatients.length > 0) {
          setPatients(supabasePatients);
          localStorage.setItem('patients', JSON.stringify(supabasePatients));
          updatePatientSummary(supabasePatients);
          
          toast({
            title: "Supabase Sync Complete",
            description: `Loaded ${supabasePatients.length} patients from Supabase.`,
          });
        }
      } catch (error) {
        console.error("Error loading patients from Supabase:", error);
        toast({
          title: "Supabase Sync Failed",
          description: "Failed to load patients from Supabase. Using local data instead.",
          variant: "destructive",
        });
      } finally {
        setIsSyncing(false);
      }
    };
    
    loadPatients();
  }, [navigate, toast]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        if (event.target && typeof event.target.result === 'string') {
          const csvData = event.target.result;
          console.log("CSV data loaded, parsing...");
          const newPatients = parseCSVData(csvData);
          
          if (newPatients.length === 0) {
            setUploadStatus(`Error: No valid patient records found in the CSV file.`);
            setIsLoading(false);
            toast({
              title: "Import failed",
              description: "No valid patient records found in the CSV file.",
              variant: "destructive",
            });
            return;
          }
          
          console.log(`Successfully parsed ${newPatients.length} patients`);
          
          // Start with fresh patients from the CSV (replace rather than combine)
          localStorage.setItem('patients', JSON.stringify(newPatients));
          
          // Update patient summary
          updatePatientSummary(newPatients);
          
          setPatients(newPatients);
          setUploadStatus(`Successfully imported ${newPatients.length} patients from the dataset.`);
          
          toast({
            title: "Dataset imported",
            description: `Successfully imported ${newPatients.length} patients.`,
          });
          
          // Sync with Supabase
          try {
            setIsSyncing(true);
            await syncPatientsWithSupabase(newPatients);
            
            toast({
              title: "Supabase Sync Complete",
              description: "Patient data successfully synced with Supabase.",
            });
          } catch (error) {
            console.error("Error syncing with Supabase:", error);
            toast({
              title: "Supabase Sync Failed",
              description: "Failed to sync patients with Supabase. Data is saved locally only.",
              variant: "destructive",
            });
          } finally {
            setIsSyncing(false);
          }
          
          // Trigger storage event for dashboard to detect the change
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('patientDataUpdated'));
        }
      } catch (error) {
        console.error("Error parsing CSV data:", error);
        setUploadStatus("Error: Failed to parse CSV data. Please check the file format.");
        
        toast({
          title: "Import failed",
          description: "There was a problem importing the dataset.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setIsLoading(false);
      setUploadStatus("Error: Failed to read the file.");
      
      toast({
        title: "Import failed",
        description: "There was a problem reading the file.",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
  };

  const handleExportCSV = async () => {
    try {
      setIsLoading(true);
      
      // Try to get the latest data from Supabase first
      let patientsToExport = patients;
      try {
        const supabasePatients = await exportPatientsFromSupabase();
        if (supabasePatients && supabasePatients.length > 0) {
          patientsToExport = supabasePatients;
          toast({
            title: "Export preparation",
            description: "Successfully fetched latest data from Supabase for export.",
          });
        }
      } catch (error) {
        console.error("Error getting patients from Supabase for export:", error);
        toast({
          title: "Supabase Connection Issue",
          description: "Using local data for export instead of Supabase data.",
          variant: "destructive",
        });
      }
      
      const csvContent = exportPatientsToCSV(patientsToExport);
      
      // Create a downloadable link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'patient_dataset.csv');
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `Exported ${patientsToExport.length} patients to CSV.`,
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      
      toast({
        title: "Export failed",
        description: "There was a problem exporting the dataset.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update patient summary for the dashboard
  const updatePatientSummary = (patients: Patient[]) => {
    const summary = {
      critical: { count: 0, patients: [] as Patient[] },
      emergency: { count: 0, patients: [] as Patient[] },
      urgent: { count: 0, patients: [] as Patient[] },
      standard: { count: 0, patients: [] as Patient[] },
      nonurgent: { count: 0, patients: [] as Patient[] }
    };
    
    // Group patients by triage level
    patients.forEach(patient => {
      if (summary[patient.triageLevel]) {
        summary[patient.triageLevel].count += 1;
        summary[patient.triageLevel].patients.push(patient);
      } else {
        console.warn(`Invalid triage level: ${patient.triageLevel}`);
      }
    });
    
    // Sort patients within each triage level by urgency percentage (descending)
    Object.keys(summary).forEach(level => {
      const triageLevel = level as "critical" | "emergency" | "urgent" | "standard" | "nonurgent";
      summary[triageLevel].patients.sort((a, b) => b.urgencyPercentage - a.urgencyPercentage);
    });
    
    localStorage.setItem('patientSummary', JSON.stringify(summary));
    console.log('Updated patient summary:', summary);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dataset Management" />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Import Dataset</CardTitle>
                <div className="text-sm text-blue-600 font-medium flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Synced with Supabase
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Upload a CSV file to import patient data. The system will automatically classify patients using the ML model and sync with Supabase.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".csv"
                      id="csv-upload"
                      className="border border-gray-300 rounded-md p-2 w-full"
                      onChange={handleFileUpload}
                      disabled={isLoading || isSyncing}
                    />
                  </div>
                </div>
              </div>
              
              {uploadStatus && (
                <Alert className={uploadStatus.startsWith('Error') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}>
                  <AlertTitle className={uploadStatus.startsWith('Error') ? 'text-red-700' : 'text-green-700'}>
                    {uploadStatus.startsWith('Error') ? 'Import Failed' : 'Import Successful'}
                  </AlertTitle>
                  <AlertDescription className={uploadStatus.startsWith('Error') ? 'text-red-600' : 'text-green-600'}>
                    {uploadStatus}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Export Dataset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Export all current patient data to a CSV file. Data will be fetched from Supabase to ensure you have the latest information.
                </p>
                <Button 
                  onClick={handleExportCSV}
                  disabled={patients.length === 0 || isLoading || isSyncing}
                  className="w-full md:w-auto flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" /> Export to CSV ({patients.length} patients)
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dataset Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-triage-critical text-white p-4 rounded-md">
                  <div className="text-3xl font-bold">
                    {patients.filter(p => p.triageLevel === 'critical').length}
                  </div>
                  <div className="text-sm">Critical</div>
                </div>
                <div className="bg-triage-emergency text-white p-4 rounded-md">
                  <div className="text-3xl font-bold">
                    {patients.filter(p => p.triageLevel === 'emergency').length}
                  </div>
                  <div className="text-sm">Emergency</div>
                </div>
                <div className="bg-triage-urgent text-white p-4 rounded-md">
                  <div className="text-3xl font-bold">
                    {patients.filter(p => p.triageLevel === 'urgent').length}
                  </div>
                  <div className="text-sm">Urgent</div>
                </div>
                <div className="bg-triage-standard text-white p-4 rounded-md">
                  <div className="text-3xl font-bold">
                    {patients.filter(p => p.triageLevel === 'standard').length}
                  </div>
                  <div className="text-sm">Standard</div>
                </div>
                <div className="bg-triage-nonurgent text-white p-4 rounded-md">
                  <div className="text-3xl font-bold">
                    {patients.filter(p => p.triageLevel === 'nonurgent').length}
                  </div>
                  <div className="text-sm">Non-urgent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatasetManagement;
