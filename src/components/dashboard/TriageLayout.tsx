
import React from 'react';
import { Patient, TriageLevel } from '@/utils/types';
import TriageSection from './TriageSection';

interface TriageLayoutProps {
  patientSummary: {
    critical: { count: number, patients: Patient[] },
    emergency: { count: number, patients: Patient[] },
    urgent: { count: number, patients: Patient[] },
    standard: { count: number, patients: Patient[] },
    nonurgent: { count: number, patients: Patient[] }
  };
  onPatientClick: (patient: Patient) => void;
  onMarkDone: (patientId: number) => void;
}

const TriageLayout: React.FC<TriageLayoutProps> = ({ 
  patientSummary, 
  onPatientClick, 
  onMarkDone 
}) => {
  // Define the sections with their properties
  const sections = [
    {
      title: "Critical",
      level: 'critical' as TriageLevel,
      colorClass: "bg-triage-critical"
    },
    {
      title: "Emergency",
      level: 'emergency' as TriageLevel,
      colorClass: "bg-triage-emergency"
    },
    {
      title: "Urgent",
      level: 'urgent' as TriageLevel,
      colorClass: "bg-triage-urgent"
    },
    {
      title: "Standard",
      level: 'standard' as TriageLevel,
      colorClass: "bg-triage-standard"
    },
    {
      title: "Non-urgent",
      level: 'nonurgent' as TriageLevel,
      colorClass: "bg-triage-nonurgent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {sections.map((section) => (
        <div className="col-span-1" key={section.level}>
          <TriageSection
            title={section.title}
            patients={patientSummary[section.level].patients || []}
            colorClass={section.colorClass}
            onPatientClick={onPatientClick}
            onMarkDone={onMarkDone}
          />
        </div>
      ))}
    </div>
  );
};

export default TriageLayout;
