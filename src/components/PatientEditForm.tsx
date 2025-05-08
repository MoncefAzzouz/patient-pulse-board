
import React, { useState } from 'react';
import { Patient, PatientFormData } from '../utils/types';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Save, X } from 'lucide-react';
import BasicInformationSection, { BasicInfoProps } from './patient-form/BasicInformationSection';
import VitalSignsSection, { VitalSignsProps } from './patient-form/VitalSignsSection';
import CardiacStatusSection, { CardiacStatusProps } from './patient-form/CardiacStatusSection';
import ClinicalAssessmentSection, { ClinicalAssessmentProps } from './patient-form/ClinicalAssessmentSection';
import AdditionalInfoSection, { AdditionalInfoProps } from './patient-form/AdditionalInfoSection';

interface PatientEditFormProps {
  patient: Patient;
  onSave: (updatedPatient: any) => void;
  onCancel: () => void;
}

const PatientEditForm: React.FC<PatientEditFormProps> = ({ patient, onSave, onCancel }) => {
  // Initialize form data from patient
  const [formData, setFormData] = useState<PatientFormData>({
    age: String(patient.age),
    gender: patient.gender,
    chestPainType: String(patient.chestPainType),
    cholesterol: String(patient.cholesterol),
    exerciseAngina: Boolean(patient.exerciseAngina),
    plasmaGlucose: String(patient.plasmaGlucose),
    skinThickness: String(patient.skinThickness || ''),
    bmi: String(patient.bmi),
    hypertension: Boolean(patient.hypertension),
    heartDisease: Boolean(patient.heartDisease),
    residenceType: patient.residenceType,
    smokingStatus: patient.smokingStatus,
    symptom: patient.symptom,
    temperature: String(patient.temperature),
    heartRate: String(patient.heartRate),
    respiratoryRate: String(patient.respiratoryRate),
    bloodPressureSys: patient.bloodPressure.split('/')[0],
    bloodPressureDia: patient.bloodPressure.split('/')[1],
    spO2: String(patient.spO2),
    glasgowScore: String(patient.glasgowScore),
    consciousness: patient.consciousness,
    massiveBleeding: Boolean(patient.massiveBleeding),
    respiratoryDistress: Boolean(patient.respiratoryDistress),
    riskFactors: patient.riskFactors || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert form data to patient data format
    const updatedPatientData = {
      age: Number(formData.age),
      gender: formData.gender,
      chestPainType: Number(formData.chestPainType),
      cholesterol: Number(formData.cholesterol),
      exerciseAngina: formData.exerciseAngina ? 1 : 0,
      plasmaGlucose: Number(formData.plasmaGlucose),
      skinThickness: Number(formData.skinThickness || 0),
      bmi: Number(formData.bmi),
      hypertension: formData.hypertension ? 1 : 0,
      heartDisease: formData.heartDisease ? 1 : 0,
      residenceType: formData.residenceType,
      smokingStatus: formData.smokingStatus,
      symptom: formData.symptom,
      temperature: Number(formData.temperature),
      heartRate: Number(formData.heartRate),
      respiratoryRate: Number(formData.respiratoryRate),
      bloodPressure: `${formData.bloodPressureSys}/${formData.bloodPressureDia}`,
      spO2: Number(formData.spO2),
      glasgowScore: Number(formData.glasgowScore),
      consciousness: formData.consciousness,
      massiveBleeding: formData.massiveBleeding,
      respiratoryDistress: formData.respiratoryDistress,
      riskFactors: formData.riskFactors,
    };
    
    onSave(updatedPatientData);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Edit Patient {patient.id}'s Information</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
        <div className="space-y-6">
          <BasicInformationSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSelectChange={handleSelectChange} 
          />
          
          <VitalSignsSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
          
          <CardiacStatusSection 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
          />
          
          <ClinicalAssessmentSection 
            formData={formData}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
          />
          
          <AdditionalInfoSection 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default PatientEditForm;
