
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PatientFormData } from '../../utils/types';

export interface CardiacStatusProps {
  formData: PatientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const CardiacStatusSection: React.FC<CardiacStatusProps> = ({ 
  formData, 
  handleInputChange, 
  handleSelectChange, 
  handleSwitchChange 
}) => {
  return (
    <div>
      <h3 className="section-header">Cardiac Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chestPainType">Chest Pain Type</Label>
          <Select onValueChange={(value) => handleSelectChange('chestPainType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select pain type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="0">Asymptomatic</SelectItem>
                <SelectItem value="1">Atypical Angina</SelectItem>
                <SelectItem value="2">Non-anginal Pain</SelectItem>
                <SelectItem value="3">Typical Angina</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cholesterol">Cholesterol (mg/dL)</Label>
          <Input 
            id="cholesterol" 
            name="cholesterol"
            type="number" 
            placeholder="Enter cholesterol"
            value={formData.cholesterol}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="exerciseAngina" className="mb-2">Exercise Angina</Label>
          <div className="flex items-center space-x-2">
            <Switch 
              id="exerciseAngina" 
              checked={formData.exerciseAngina}
              onCheckedChange={(checked) => handleSwitchChange('exerciseAngina', checked)}
            />
            <Label htmlFor="exerciseAngina">
              {formData.exerciseAngina ? 'Yes' : 'No'}
            </Label>
          </div>
        </div>
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="heartDisease" className="mb-2">Heart Disease</Label>
          <div className="flex items-center space-x-2">
            <Switch 
              id="heartDisease" 
              checked={formData.heartDisease}
              onCheckedChange={(checked) => handleSwitchChange('heartDisease', checked)}
            />
            <Label htmlFor="heartDisease">
              {formData.heartDisease ? 'Yes' : 'No'}
            </Label>
          </div>
        </div>
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="hypertension" className="mb-2">Hypertension</Label>
          <div className="flex items-center space-x-2">
            <Switch 
              id="hypertension" 
              checked={formData.hypertension}
              onCheckedChange={(checked) => handleSwitchChange('hypertension', checked)}
            />
            <Label htmlFor="hypertension">
              {formData.hypertension ? 'Yes' : 'No'}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardiacStatusSection;
