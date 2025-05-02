
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
  
  // Get emoji based on triage level
  const getEmoji = () => {
    switch(patient.triageLevel) {
      case 'critical': return '🚨';
      case 'emergency': return '⚠️';
      case 'urgent': return '⚡';
      case 'standard': return '🏥';
      case 'nonurgent': return '✅';
      default: return '🔍';
    }
  };
  
  // Determine if we need special animation for critical/emergency cases
  const needsAttention = patient.triageLevel === 'critical' && patient.urgencyPercentage > 90;

  return (
    <div 
      className={`${getTriageClassName()} ${needsAttention ? 'animate-shake' : ''}`} 
      onClick={onClick}
    >
      <div>
        <div className="font-semibold flex items-center gap-2">
          {getEmoji()} Patient {patient.id}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {patient.age} yrs, {patient.gender}
        </div>
        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full bg-${patient.triageLevel === 'critical' ? 'red' : patient.triageLevel === 'emergency' ? 'orange' : patient.triageLevel === 'urgent' ? 'amber' : patient.triageLevel === 'standard' ? 'green' : 'blue'}-500`}></div>
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
