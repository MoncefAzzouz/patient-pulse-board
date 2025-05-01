
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

  return (
    <div className={getTriageClassName()} onClick={onClick}>
      <div>
        <div className="font-semibold">Patient {patient.id}</div>
        <div className="text-sm text-gray-600">
          {patient.age} yrs, {patient.gender}
        </div>
      </div>
      <div className={getUrgencyClassName()}>
        {patient.urgencyPercentage}%
      </div>
    </div>
  );
};

export default PatientCard;
