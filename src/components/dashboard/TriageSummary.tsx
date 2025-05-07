
import React from 'react';
import TriageSummaryCard from './TriageSummaryCard';

interface TriageSummaryProps {
  patientSummary: {
    critical: { count: number, patients: any[] },
    emergency: { count: number, patients: any[] },
    urgent: { count: number, patients: any[] },
    standard: { count: number, patients: any[] },
    nonurgent: { count: number, patients: any[] }
  };
}

const TriageSummary: React.FC<TriageSummaryProps> = ({ patientSummary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
      <TriageSummaryCard 
        count={patientSummary.critical.count} 
        title="Critical" 
        colorClass="triage-card-critical" 
      />
      <TriageSummaryCard 
        count={patientSummary.emergency.count} 
        title="Emergency" 
        colorClass="triage-card-emergency" 
      />
      <TriageSummaryCard 
        count={patientSummary.urgent.count} 
        title="Urgent" 
        colorClass="triage-card-urgent" 
      />
      <TriageSummaryCard 
        count={patientSummary.standard.count} 
        title="Standard" 
        colorClass="triage-card-standard" 
      />
      <TriageSummaryCard 
        count={patientSummary.nonurgent.count} 
        title="Non-urgent" 
        colorClass="triage-card-nonurgent" 
      />
    </div>
  );
};

export default TriageSummary;
