
import React from 'react';
import { Patient } from '../utils/types';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const getTriageClassName = () => {
    return `patient-card patient-card-${patient.triageLevel}`;
  };

  const getUrgencyClassName = () => {
    return `urgency-tag urgency-tag-${patient.triageLevel}`;
  };

  // Get severity level text
  const getSeverityText = () => {
    if (patient.urgencyPercentage >= 90) return 'Extreme';
    if (patient.urgencyPercentage >= 75) return 'High';
    if (patient.urgencyPercentage >= 50) return 'Moderate';
    if (patient.urgencyPercentage >= 30) return 'Low';
    return 'Minimal';
  };

  return (
    <div className={getTriageClassName()} onClick={onClick}>
      <div>
        <div className="font-semibold">Patient {patient.id}</div>
        <div className="text-sm text-gray-600">
          {patient.age} yrs, {patient.gender}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Severity: {getSeverityText()}
        </div>
      </div>
      <div className={getUrgencyClassName()}>
        {patient.urgencyPercentage}%
      </div>
    </div>
  );
};

export default PatientCard;
