
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PatientWarningsProps {
  warnings: string[];
}

const PatientWarnings: React.FC<PatientWarningsProps> = ({ warnings }) => {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTitle className="text-amber-700">Patient Risk Factors Detected</AlertTitle>
        <AlertDescription className="text-amber-600">
          <ul className="list-disc pl-5 mt-2">
            {warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PatientWarnings;
