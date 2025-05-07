
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Emergency Department Triage Dashboard</h1>
      <Link to="/fingerprint-scan">
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <CreditCard className="h-4 w-4" />
          Shifaa Card Reader
        </Button>
      </Link>
    </div>
  );
};

export default DashboardHeader;
