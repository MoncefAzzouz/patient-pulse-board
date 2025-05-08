
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PatientFormData } from '../../utils/types';

export interface AdditionalInfoProps {
  formData: PatientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoProps> = ({ 
  formData, 
  handleInputChange 
}) => {
  return (
    <div>
      <h3 className="section-header">Additional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bmi">BMI</Label>
          <Input 
            id="bmi" 
            name="bmi"
            type="number" 
            step="0.1"
            placeholder="Enter BMI"
            value={formData.bmi}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plasmaGlucose">Plasma Glucose (mg/dL)</Label>
          <Input 
            id="plasmaGlucose" 
            name="plasmaGlucose"
            type="number" 
            placeholder="Enter plasma glucose"
            value={formData.plasmaGlucose}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="skinThickness">Skin Thickness (mm)</Label>
          <Input 
            id="skinThickness" 
            name="skinThickness"
            type="number" 
            placeholder="Enter skin thickness"
            value={formData.skinThickness}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2 md:col-span-3">
          <Label htmlFor="riskFactors">Risk Factors</Label>
          <Textarea 
            id="riskFactors" 
            name="riskFactors"
            placeholder="Enter patient's risk factors"
            value={formData.riskFactors}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
