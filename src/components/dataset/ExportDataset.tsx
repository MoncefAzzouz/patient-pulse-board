
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportPatientsToCSV } from '../../utils/csvHandler';
import { Patient } from '../../utils/types';

interface ExportDatasetProps {
  patients: Patient[];
}

const ExportDataset: React.FC<ExportDatasetProps> = ({ patients }) => {
  const { toast } = useToast();

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

  return (
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
  );
};

export default ExportDataset;
