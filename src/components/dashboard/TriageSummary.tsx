
import React from 'react';
import { TriageSummaryProps } from '../../types/dashboard';

const TriageSummary: React.FC<TriageSummaryProps> = ({ patientSummary }) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
    <div className="triage-card triage-card-critical">
      <div className="text-3xl font-bold">{patientSummary.critical.count}</div>
      <div className="text-sm">Critical</div>
    </div>
    <div className="triage-card triage-card-emergency">
      <div className="text-3xl font-bold">{patientSummary.emergency.count}</div>
      <div className="text-sm">Emergency</div>
    </div>
    <div className="triage-card triage-card-urgent">
      <div className="text-3xl font-bold">{patientSummary.urgent.count}</div>
      <div className="text-sm">Urgent</div>
    </div>
    <div className="triage-card triage-card-standard">
      <div className="text-3xl font-bold">{patientSummary.standard.count}</div>
      <div className="text-sm">Standard</div>
    </div>
    <div className="triage-card triage-card-nonurgent">
      <div className="text-3xl font-bold">{patientSummary.nonurgent.count}</div>
      <div className="text-sm">Non-urgent</div>
    </div>
  </div>
);

export default TriageSummary;
