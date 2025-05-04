
import React from 'react';
import { Patient } from '../utils/types';
import { Card } from './ui/card';
import { Heart, AlertTriangle, Activity, Check, Info, X } from 'lucide-react';
import { Button } from './ui/button';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
  onSkip?: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick, onSkip }) => {
  // Check if patient is undefined or null
  if (!patient) {
    console.log("Undefined patient in PatientCard");
    return null;
  }
  
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
  
  // Get icon based on triage level
  const getIcon = () => {
    switch(patient.triageLevel) {
      case 'critical': 
        return <AlertTriangle className="h-5 w-5 text-triage-critical" />;
      case 'emergency': 
        return <Heart className="h-5 w-5 text-triage-emergency" />;
      case 'urgent': 
        return <Activity className="h-5 w-5 text-triage-urgent" />;
      case 'standard': 
        return <Info className="h-5 w-5 text-triage-standard" />;
      case 'nonurgent': 
        return <Check className="h-5 w-5 text-triage-nonurgent" />;
      default: 
        return <Info className="h-5 w-5" />;
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card onClick
    if (onSkip) {
      onSkip(patient.id);
    }
  };

  return (
    <Card 
      className={getTriageClassName()} 
      onClick={onClick}
    >
      <div className="flex justify-between items-center w-full">
        <div>
          <div className="font-semibold flex items-center gap-2">
            {getIcon()} Patient {patient.id}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {patient.age} yrs, {patient.gender}
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full bg-${patient.triageLevel === 'critical' ? 'red' : patient.triageLevel === 'emergency' ? 'orange' : patient.triageLevel === 'urgent' ? 'amber' : patient.triageLevel === 'standard' ? 'green' : 'blue'}-500`}></div>
            Severity: {getSeverityText()}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className={getUrgencyClassName()}>
            {patient.urgencyPercentage}%
          </div>
          {onSkip && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={handleSkip}
            >
              <X className="h-4 w-4 mr-1" /> Skip
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PatientCard;
