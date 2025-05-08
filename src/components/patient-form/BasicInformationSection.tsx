
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PatientFormData } from '../../utils/types';

export interface BasicInfoProps {
  formData: PatientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const BasicInformationSection: React.FC<BasicInfoProps> = ({ 
  formData, 
  handleInputChange, 
  handleSelectChange 
}) => {
  return (
    <div>
      <h3 className="section-header">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input 
            id="age" 
            name="age"
            type="number" 
            placeholder="Enter age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={(value) => handleSelectChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="residenceType">Residence Type</Label>
          <Select onValueChange={(value) => handleSelectChange('residenceType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select residence type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Urban">Urban</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="smokingStatus">Smoking Status</Label>
          <Select onValueChange={(value) => handleSelectChange('smokingStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select smoking status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="never smoked">Never Smoked</SelectItem>
                <SelectItem value="former smoker">Former Smoker</SelectItem>
                <SelectItem value="current smoker">Current Smoker</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="symptom">Symptoms</Label>
          <Textarea 
            id="symptom" 
            name="symptom"
            placeholder="Enter patient's symptoms"
            value={formData.symptom}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;
