
import React from 'react';
import { Button } from '@/components/ui/button';

interface PatientFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const PatientFormActions: React.FC<PatientFormActionsProps> = ({ isLoading, onCancel }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Patient"}
      </Button>
    </div>
  );
};

export default PatientFormActions;
