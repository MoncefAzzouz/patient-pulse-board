
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseCSVData, addPatientsToDatabase } from '../../utils/csvHandler';
import { Patient } from '../../utils/types';
import { addPatientsToSupabase } from '../../utils/supabasePatients';

interface ImportDatasetProps {
  onImport: (newPatients: Patient[]) => void;
}

const ImportDataset: React.FC<ImportDatasetProps> = ({ onImport }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

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
          const newPatients = parseCSVData(csvData);
          
          if (newPatients.length === 0) {
            throw new Error("No patients could be parsed from the file. Please check the CSV format.");
          }
          
          console.log("Parsed patients:", newPatients);
          
          // Add patients to Supabase
          const addedCount = await addPatientsToSupabase(newPatients);
          
          // Also add to local database
          addPatientsToDatabase(newPatients);
          
          // Update parent component
          onImport(newPatients);
          
          setUploadStatus(`Successfully imported ${newPatients.length} patients from the dataset.`);
          
          toast({
            title: "Dataset imported",
            description: `Successfully imported ${newPatients.length} patients.`,
          });
        }
      } catch (error) {
        console.error("Error parsing CSV data:", error);
        setUploadStatus(`Error: ${error instanceof Error ? error.message : "Failed to parse CSV data. Please check the file format."}`);
        
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

  return (
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
  );
};

export default ImportDataset;
