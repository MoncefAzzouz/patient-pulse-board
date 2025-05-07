import React, { useState } from 'react';
import { Patient, PatientFormData } from '../utils/types';
import { processNewPatient } from '../utils/triageModel';
import { Button } from './ui/button';
import BasicInformationSection from './patient-form/BasicInformationSection';
import VitalSignsSection from './patient-form/VitalSignsSection';
import CardiacStatusSection from './patient-form/CardiacStatusSection';
import ClinicalAssessmentSection from './patient-form/ClinicalAssessmentSection';
import AdditionalInfoSection from './patient-form/AdditionalInfoSection';

interface PatientEditFormProps {
  patient: Patient;
  onCancel: () => void;
  onSave: (updatedPatient: Patient) => void;
}

const PatientEditForm: React.FC<PatientEditFormProps> = ({ patient, onCancel, onSave }) => {
  // Initialize form data from patient object
  const [formData, setFormData] = useState<PatientFormData>({
    age: patient.age.toString(),
    gender: patient.gender,
    chestPainType: patient.chestPainType.toString(),
    cholesterol: patient.cholesterol.toString(),
    exerciseAngina: Boolean(patient.exerciseAngina),
    plasmaGlucose: patient.plasmaGlucose.toString(),
    skinThickness: patient.skinThickness.toString(),
    bmi: patient.bmi.toString(),
    hypertension: Boolean(patient.hypertension),
    heartDisease: Boolean(patient.heartDisease),
    residenceType: patient.residenceType,
    smokingStatus: patient.smokingStatus,
    symptom: patient.symptom,
    temperature: patient.temperature.toString(),
    heartRate: patient.heartRate.toString(),
    respiratoryRate: patient.respiratoryRate.toString(),
    bloodPressureSys: patient.bloodPressure.split('/')[0],
    bloodPressureDia: patient.bloodPressure.split('/')[1],
    spO2: patient.spO2.toString(),
    glasgowScore: patient.glasgowScore.toString(),
    consciousness: patient.consciousness,
    massiveBleeding: patient.massiveBleeding,
    respiratoryDistress: patient.respiratoryDistress,
    riskFactors: patient.riskFactors
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert form data to patient data format
    const patientData = {
      id: patient.id,
      age: parseInt(formData.age),
      gender: formData.gender,
      chestPainType: parseInt(formData.chestPainType),
      cholesterol: parseInt(formData.cholesterol),
      exerciseAngina: formData.exerciseAngina ? 1 : 0,
      plasmaGlucose: parseInt(formData.plasmaGlucose),
      skinThickness: parseInt(formData.skinThickness),
      bmi: parseFloat(formData.bmi),
      hypertension: formData.hypertension ? 1 : 0,
      heartDisease: formData.heartDisease ? 1 : 0,
      residenceType: formData.residenceType,
      smokingStatus: formData.smokingStatus,
      symptom: formData.symptom,
      temperature: parseFloat(formData.temperature),
      heartRate: parseInt(formData.heartRate),
      respiratoryRate: parseInt(formData.respiratoryRate),
      bloodPressure: `${formData.bloodPressureSys}/${formData.bloodPressureDia}`,
      spO2: parseFloat(formData.spO2),
      glasgowScore: parseFloat(formData.glasgowScore),
      consciousness: formData.consciousness,
      massiveBleeding: formData.massiveBleeding,
      respiratoryDistress: formData.respiratoryDistress,
      riskFactors: formData.riskFactors || '',
    };
    
    // Process patient data to calculate triage level
    const updatedPatient = processNewPatient(patientData, false);
    
    // Keep the original ID
    updatedPatient.id = patient.id;
    
    // Call onSave with the updated patient data
    onSave(updatedPatient);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 gap-6">
        <BasicInformationSection formData={formData} onChange={handleInputChange} />
        <VitalSignsSection formData={formData} onChange={handleInputChange} />
        <CardiacStatusSection formData={formData} onChange={handleInputChange} />
        <ClinicalAssessmentSection formData={formData} onChange={handleInputChange} />
        <AdditionalInfoSection formData={formData} onChange={handleInputChange} />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default PatientEditForm;
