
import React from 'react';

interface TriageSummaryCardProps {
  count: number;
  title: string;
  colorClass: string;
}

const TriageSummaryCard: React.FC<TriageSummaryCardProps> = ({ count, title, colorClass }) => {
  return (
    <div className={`triage-card ${colorClass}`}>
      <div className="text-3xl font-bold">{count}</div>
      <div className="text-sm">{title}</div>
    </div>
  );
};

export default TriageSummaryCard;
