
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { TriageLevel } from '../../utils/types';

interface PatientFormHeaderProps {
  calculatedTriage: TriageLevel;
  urgencyPercentage: number;
}

const PatientFormHeader: React.FC<PatientFormHeaderProps> = ({ calculatedTriage, urgencyPercentage }) => {
  const getTriageColor = () => {
    switch (calculatedTriage) {
      case 'critical': return 'text-triage-critical';
      case 'emergency': return 'text-triage-emergency';
      case 'urgent': return 'text-triage-urgent';
      case 'standard': return 'text-triage-standard';
      case 'nonurgent': return 'text-triage-nonurgent';
      default: return '';
    }
  };

  return (
    <CardTitle className="flex justify-between items-center">
      <span>New Patient Registration</span>
      <div className="flex items-center gap-4">
        <span className="text-base">
          Urgency: 
          <span className={`ml-2 font-bold ${getTriageColor()}`}>
            {urgencyPercentage}%
          </span>
        </span>
        <span className="text-base">
          Predicted Triage: 
          <span className={`ml-2 font-bold capitalize ${getTriageColor()}`}>
            {calculatedTriage}
          </span>
        </span>
      </div>
    </CardTitle>
  );
};

export default PatientFormHeader;
