
import React from 'react';
import TriageSection from './TriageSection';
import { PatientSummary } from '../../types/dashboard';
import { Patient } from '../../utils/types';

interface TriageColumnsProps {
  patientSummary: PatientSummary;
  onPatientClick: (patient: Patient) => void;
  onPatientDone: (patient: Patient) => void;
}

const TriageColumns: React.FC<TriageColumnsProps> = ({
  patientSummary,
  onPatientClick,
  onPatientDone
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="col-span-1">
        <TriageSection 
          title="Critical" 
          patients={patientSummary.critical.patients || []} 
          colorClass="bg-triage-critical"
          onPatientClick={onPatientClick}
          onPatientDone={onPatientDone}
        />
      </div>
      <div className="col-span-1">
        <TriageSection 
          title="Emergency" 
          patients={patientSummary.emergency.patients || []} 
          colorClass="bg-triage-emergency"
          onPatientClick={onPatientClick}
          onPatientDone={onPatientDone}
        />
      </div>
      <div className="col-span-1">
        <TriageSection 
          title="Urgent" 
          patients={patientSummary.urgent.patients || []} 
          colorClass="bg-triage-urgent"
          onPatientClick={onPatientClick}
          onPatientDone={onPatientDone}
        />
      </div>
      <div className="col-span-1">
        <TriageSection 
          title="Standard" 
          patients={patientSummary.standard.patients || []} 
          colorClass="bg-triage-standard"
          onPatientClick={onPatientClick}
          onPatientDone={onPatientDone}
        />
      </div>
      <div className="col-span-1">
        <TriageSection 
          title="Non-urgent" 
          patients={patientSummary.nonurgent.patients || []} 
          colorClass="bg-triage-nonurgent"
          onPatientClick={onPatientClick}
          onPatientDone={onPatientDone}
        />
      </div>
    </div>
  );
};

export default TriageColumns;
