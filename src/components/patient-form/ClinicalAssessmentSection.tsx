
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PatientFormData } from '../../utils/types';

export interface ClinicalAssessmentProps {
  formData: PatientFormData;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const ClinicalAssessmentSection: React.FC<ClinicalAssessmentProps> = ({ 
  formData, 
  handleSelectChange, 
  handleSwitchChange 
}) => {
  return (
    <div>
      <h3 className="section-header">Clinical Assessment</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="glasgowScore">Glasgow Score</Label>
          <Select onValueChange={(value) => handleSelectChange('glasgowScore', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select score" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Glasgow Coma Scale</SelectLabel>
                {[3,4,5,6,7,8,9,10,11,12,13,14,15].map(score => (
                  <SelectItem key={score} value={String(score)}>
                    {score}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="consciousness">Consciousness</Label>
          <Select onValueChange={(value) => handleSelectChange('consciousness', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Awake">Awake</SelectItem>
                <SelectItem value="Verbal response">Responds to verbal</SelectItem>
                <SelectItem value="Responsive to pain">Responsive to pain</SelectItem>
                <SelectItem value="Unresponsive">Unresponsive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="respiratoryDistress" className="mb-2">Respiratory Distress</Label>
          <div className="flex items-center space-x-2">
            <Switch 
              id="respiratoryDistress" 
              checked={formData.respiratoryDistress}
              onCheckedChange={(checked) => handleSwitchChange('respiratoryDistress', checked)}
            />
            <Label htmlFor="respiratoryDistress">
              {formData.respiratoryDistress ? 'Yes' : 'No'}
            </Label>
          </div>
        </div>
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="massiveBleeding" className="mb-2">Massive Bleeding</Label>
          <div className="flex items-center space-x-2">
            <Switch 
              id="massiveBleeding" 
              checked={formData.massiveBleeding}
              onCheckedChange={(checked) => handleSwitchChange('massiveBleeding', checked)}
            />
            <Label htmlFor="massiveBleeding">
              {formData.massiveBleeding ? 'Yes' : 'No'}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalAssessmentSection;
