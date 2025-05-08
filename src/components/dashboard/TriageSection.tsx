
import React from 'react';
import PatientCard from '../PatientCard';
import { Patient } from '../../utils/types';

interface TriageSectionProps {
  title: string;
  patients: Patient[];
  colorClass: string;
  onPatientClick: (patient: Patient) => void;
  onPatientDone: (patient: Patient) => void;
}

const TriageSection: React.FC<TriageSectionProps> = ({
  title,
  patients,
  colorClass,
  onPatientClick,
  onPatientDone
}) => (
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
          onDone={() => onPatientDone(patient)}
        />
      ))}
    </div>
  </div>
);

export default TriageSection;
