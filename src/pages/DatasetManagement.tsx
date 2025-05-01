
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { parseCSVData, exportPatientsToCSV } from '../utils/csvHandler';
import { Patient } from '../utils/types';

const DatasetManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    // Load patients from localStorage
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  }, [navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (event.target && typeof event.target.result === 'string') {
          const csvData = event.target.result;
          const newPatients = parseCSVData(csvData);
          
          // Update localStorage with new patients
          const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
          const combinedPatients = [...existingPatients, ...newPatients];
          localStorage.setItem('patients', JSON.stringify(combinedPatients));
          
          // Update patient summary
          updatePatientSummary(combinedPatients);
          
          setPatients(combinedPatients);
          setUploadStatus(`Successfully imported ${newPatients.length} patients from the dataset.`);
          
          toast({
            title: "Dataset imported",
            description: `Successfully imported ${newPatients.length} patients.`,
          });
          
          // Trigger storage event for dashboard to detect the change
          window.dispatchEvent(new Event('storage'));
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

  const handleExportCSV = () => {
    try {
      const csvContent = exportPatientsToCSV(patients);
      
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
        description: `Exported ${patients.length} patients to CSV.`,
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      
      toast({
        title: "Export failed",
        description: "There was a problem exporting the dataset.",
        variant: "destructive",
      });
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
      summary[patient.triageLevel].count += 1;
      summary[patient.triageLevel].patients.push(patient);
    });
    
    // Sort patients within each triage level by urgency percentage (descending)
    Object.keys(summary).forEach(level => {
      const triageLevel = level as "critical" | "emergency" | "urgent" | "standard" | "nonurgent";
      summary[triageLevel].patients.sort((a, b) => b.urgencyPercentage - a.urgencyPercentage);
    });
    
    localStorage.setItem('patientSummary', JSON.stringify(summary));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dataset Management" />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Dataset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Upload a CSV file to import patient data. The system will automatically classify patients using the ML model.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".csv"
                      id="csv-upload"
                      className="border border-gray-300 rounded-md p-2 w-full"
                      onChange={handleFileUpload}
                      disabled={isLoading}
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
                  Export all current patient data to a CSV file. The export includes triage levels and urgency percentages.
                </p>
                <Button 
                  onClick={handleExportCSV}
                  disabled={patients.length === 0}
                  className="w-full md:w-auto"
                >
                  Export to CSV ({patients.length} patients)
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
