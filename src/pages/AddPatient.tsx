import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PatientFormHeader from '../components/patient-form/PatientFormHeader';
import BasicInformationSection from '../components/patient-form/BasicInformationSection';
import VitalSignsSection from '../components/patient-form/VitalSignsSection';
import CardiacStatusSection from '../components/patient-form/CardiacStatusSection';
import ClinicalAssessmentSection from '../components/patient-form/ClinicalAssessmentSection';
import AdditionalInfoSection from '../components/patient-form/AdditionalInfoSection';
import PatientFormActions from '../components/patient-form/PatientFormActions';
import PatientWarnings from '../components/patient-form/PatientWarnings';
import { Card, CardContent } from '@/components/ui/card';
import { PatientFormData, Patient } from '../utils/types';
import { processNewPatient, updatePatientSummary, getPatientWarnings } from '../utils/triageModel';
import { toast } from "sonner";
import { addPatientToSupabase } from '../utils/supabasePatients';

const AddPatient = () => {
  const [formData, setFormData] = useState<PatientFormData>({
    age: '',
    gender: 'Male',
    chestPainType: '0',
    cholesterol: '',
    exerciseAngina: false,
    plasmaGlucose: '',
    skinThickness: '',
    bmi: '',
    hypertension: false,
    heartDisease: false,
    residenceType: 'Urban',
    smokingStatus: 'Never',
    symptom: '',
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    spO2: '',
    glasgowScore: '15',
    consciousness: 'Awake',
    massiveBleeding: false,
    respiratoryDistress: false,
    riskFactors: '',
  });
  
  const [previewPatient, setPreviewPatient] = useState<Patient | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear preview when form changes
    if (previewPatient) {
      setPreviewPatient(null);
      setWarnings([]);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear preview when form changes
    if (previewPatient) {
      setPreviewPatient(null);
      setWarnings([]);
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Clear preview when form changes
    if (previewPatient) {
      setPreviewPatient(null);
      setWarnings([]);
    }
  };

  const handlePreviewClick = () => {
    if (validateForm()) {
      setFormSubmitted(true);
      try {
        const patientData = preparePatientData();
        const newPatient = processNewPatient(patientData);
        
        setPreviewPatient(newPatient);
        setWarnings(getPatientWarnings(newPatient));
        
        toast.success("Patient data processed. Review the triage level before submitting.");
      } catch (error) {
        console.error("Error processing patient data:", error);
        toast.error("Error processing patient data. Please check your inputs.");
      }
    } else {
      setFormSubmitted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setFormSubmitted(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate new patient data if not already previewed
      let patientToAdd = previewPatient;
      
      if (!patientToAdd) {
        const patientData = preparePatientData();
        patientToAdd = processNewPatient(patientData);
      }
      
      // Add to Supabase database
      await addPatientToSupabase(patientToAdd);
      
      // Update local storage and summary
      updatePatientSummary(patientToAdd);
      
      // Show success message
      toast.success(`Patient ${patientToAdd.id} added and triaged as ${patientToAdd.triageLevel.toUpperCase()} (${patientToAdd.urgencyPercentage}% urgency)`);
      
      // Reset form
      resetForm();
      
      // Go to dashboard
      navigate('/');
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to add patient. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    // Basic validation - required fields
    const requiredFields: (keyof PatientFormData)[] = [
      'age', 'gender', 'temperature', 'heartRate', 
      'respiratoryRate', 'bloodPressureSys', 'bloodPressureDia', 
      'spO2', 'glasgowScore', 'consciousness'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        return false;
      }
    }
    
    return true;
  };

  const preparePatientData = () => {
    return {
      age: Number(formData.age),
      gender: formData.gender,
      chestPainType: Number(formData.chestPainType),
      cholesterol: Number(formData.cholesterol) || 0,
      exerciseAngina: formData.exerciseAngina ? 1 : 0,
      plasmaGlucose: Number(formData.plasmaGlucose) || 0,
      skinThickness: Number(formData.skinThickness) || 0,
      bmi: Number(formData.bmi) || 0,
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
      riskFactors: formData.riskFactors
    };
  };

  const resetForm = () => {
    setFormData({
      age: '',
      gender: 'Male',
      chestPainType: '0',
      cholesterol: '',
      exerciseAngina: false,
      plasmaGlucose: '',
      skinThickness: '',
      bmi: '',
      hypertension: false,
      heartDisease: false,
      residenceType: 'Urban',
      smokingStatus: 'Never',
      symptom: '',
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      bloodPressureSys: '',
      bloodPressureDia: '',
      spO2: '',
      glasgowScore: '15',
      consciousness: 'Awake',
      massiveBleeding: false,
      respiratoryDistress: false,
      riskFactors: '',
    });
    setPreviewPatient(null);
    setWarnings([]);
    setFormSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <PatientFormHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <BasicInformationSection 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    handleSelectChange={handleSelectChange} 
                    formSubmitted={formSubmitted}
                  />
                  
                  <VitalSignsSection 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    formSubmitted={formSubmitted}
                  />
                  
                  <CardiacStatusSection 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    handleSwitchChange={handleSwitchChange}
                    formSubmitted={formSubmitted}
                  />
                  
                  <ClinicalAssessmentSection 
                    formData={formData}
                    handleSelectChange={handleSelectChange}
                    handleSwitchChange={handleSwitchChange}
                    formSubmitted={formSubmitted}
                  />
                  
                  <AdditionalInfoSection 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    formSubmitted={formSubmitted}
                  />
                  
                  <PatientFormActions 
                    onPreviewClick={handlePreviewClick}
                    onReset={resetForm}
                    isSubmitting={isSubmitting}
                    previewAvailable={!!previewPatient}
                  />
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <PatientWarnings 
              patient={previewPatient}
              warnings={warnings}
              onAddPatient={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
