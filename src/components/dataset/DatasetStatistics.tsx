
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '../../utils/types';

interface DatasetStatisticsProps {
  patients: Patient[];
}

const DatasetStatistics: React.FC<DatasetStatisticsProps> = ({ patients }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-triage-critical text-white p-4 rounded-md">
            <div className="text-3xl font-bold">
              {patients.filter(p => p.triageLevel === 'critical').length}
            </div>
            <div className="text-sm">Critical</div>
          </div>
          <div className="bg-triage-emergency text-white p-4 rounded-md">
            <div className="text-3xl font-bold">
              {patients.filter(p => p.triageLevel === 'emergency').length}
            </div>
            <div className="text-sm">Emergency</div>
          </div>
          <div className="bg-triage-urgent text-white p-4 rounded-md">
            <div className="text-3xl font-bold">
              {patients.filter(p => p.triageLevel === 'urgent').length}
            </div>
            <div className="text-sm">Urgent</div>
          </div>
          <div className="bg-triage-standard text-white p-4 rounded-md">
            <div className="text-3xl font-bold">
              {patients.filter(p => p.triageLevel === 'standard').length}
            </div>
            <div className="text-sm">Standard</div>
          </div>
          <div className="bg-triage-nonurgent text-white p-4 rounded-md">
            <div className="text-3xl font-bold">
              {patients.filter(p => p.triageLevel === 'nonurgent').length}
            </div>
            <div className="text-sm">Non-urgent</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetStatistics;
