
import React from 'react';
import { Patient } from '@/utils/types';
import PatientCard from '@/components/PatientCard';

interface TriageSectionProps {
  title: string;
  patients: Patient[];
  colorClass: string;
  onPatientClick: (patient: Patient) => void;
  onMarkDone: (patientId: number) => void;
}

const TriageSection: React.FC<TriageSectionProps> = ({ 
  title, 
  patients, 
  colorClass,
  onPatientClick,
  onMarkDone
}) => {
  return (
    <div className="mb-6">
      <div className={`text-white font-bold px-4 py-2 mb-2 ${colorClass} rounded`}>
        {title}
      </div>
      <div className="px-1">
        {patients && patients.map((patient) => (
          <PatientCard
            key={`patient-${patient.id}`}
            patient={patient}
            onClick={() => onPatientClick(patient)}
            onMarkDone={onMarkDone}
          />
        ))}
      </div>
    </div>
  );
};

export default TriageSection;
