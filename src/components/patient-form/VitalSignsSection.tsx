
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PatientFormData } from '../../utils/types';

export interface VitalSignsProps {
  formData: PatientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const VitalSignsSection: React.FC<VitalSignsProps> = ({ 
  formData, 
  handleInputChange 
}) => {
  return (
    <div>
      <h3 className="section-header">Vital Signs</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input 
            id="temperature" 
            name="temperature"
            type="number" 
            step="0.1"
            placeholder="Enter temperature"
            value={formData.temperature}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
          <Input 
            id="heartRate" 
            name="heartRate"
            type="number" 
            placeholder="Enter heart rate"
            value={formData.heartRate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
          <Input 
            id="respiratoryRate" 
            name="respiratoryRate"
            type="number" 
            placeholder="Enter respiratory rate"
            value={formData.respiratoryRate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Blood Pressure (mmHg)</Label>
          <div className="flex gap-2">
            <Input 
              id="bloodPressureSys" 
              name="bloodPressureSys"
              type="number" 
              placeholder="Systolic"
              value={formData.bloodPressureSys}
              onChange={handleInputChange}
              required
            />
            <span className="flex items-center">/</span>
            <Input 
              id="bloodPressureDia" 
              name="bloodPressureDia"
              type="number" 
              placeholder="Diastolic"
              value={formData.bloodPressureDia}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="spO2">SpO2 (%)</Label>
          <Input 
            id="spO2" 
            name="spO2"
            type="number" 
            min="0"
            max="100"
            placeholder="Enter SpO2"
            value={formData.spO2}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default VitalSignsSection;
