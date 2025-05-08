import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import { PatientFormData, TriageLevel } from '../utils/types';
import { processNewPatient, getPatientWarnings } from '../utils/triageModel';
import { appendPatientToCSV } from '../utils/csvHandler';
import { addPatientToSupabase } from '../utils/supabasePatients';

// Import form components
import PatientFormHeader from '../components/patient-form/PatientFormHeader';
import PatientWarnings from '../components/patient-form/PatientWarnings';
import BasicInformationSection from '../components/patient-form/BasicInformationSection';
import VitalSignsSection from '../components/patient-form/VitalSignsSection';
import CardiacStatusSection from '../components/patient-form/CardiacStatusSection';
import ClinicalAssessmentSection from '../components/patient-form/ClinicalAssessmentSection';
import AdditionalInfoSection from '../components/patient-form/AdditionalInfoSection';
import PatientFormActions from '../components/patient-form/PatientFormActions';

const AddPatient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic form state
  const [formData, setFormData] = useState<PatientFormData>({
    age: '',
    gender: '',
    chestPainType: '',
    cholesterol: '',
    exerciseAngina: false,
    plasmaGlucose: '',
    skinThickness: '',
    bmi: '',
    hypertension: false,
    heartDisease: false,
    residenceType: '',
    smokingStatus: '',
    symptom: '',
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    spO2: '',
    glasgowScore: '',
    consciousness: '',
    massiveBleeding: false,
    respiratoryDistress: false,
    riskFactors: ''
  });

  const [calculatedTriage, setCalculatedTriage] = useState<TriageLevel>('standard');
  const [urgencyPercentage, setUrgencyPercentage] = useState<number>(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<{triageLevel: TriageLevel, urgencyPercentage: number} | null>(null);
  
  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Preview the triage level without saving the patient
  useEffect(() => {
    try {
      // Only calculate if enough critical data is present
      if (
        formData.age && 
        formData.temperature && 
        formData.heartRate && 
        formData.respiratoryRate && 
        formData.spO2 && 
        formData.glasgowScore
      ) {
        // Prepare patient data object for prediction (preview only)
        const patientData = {
          age: parseInt(formData.age, 10),
          gender: formData.gender,
          chestPainType: parseInt(formData.chestPainType || '0', 10),
          cholesterol: parseInt(formData.cholesterol || '0', 10),
          exerciseAngina: formData.exerciseAngina ? 1 : 0,
          plasmaGlucose: parseInt(formData.plasmaGlucose || '0', 10),
          skinThickness: parseInt(formData.skinThickness || '0', 10),
          bmi: parseFloat(formData.bmi || '0'),
          hypertension: formData.hypertension ? 1 : 0,
          heartDisease: formData.heartDisease ? 1 : 0,
          residenceType: formData.residenceType,
          smokingStatus: formData.smokingStatus,
          symptom: formData.symptom,
          temperature: parseFloat(formData.temperature),
          heartRate: parseInt(formData.heartRate, 10),
          respiratoryRate: parseInt(formData.respiratoryRate, 10),
          bloodPressure: `${formData.bloodPressureSys || '0'}/${formData.bloodPressureDia || '0'}`,
          spO2: parseInt(formData.spO2, 10),
          glasgowScore: parseInt(formData.glasgowScore, 10),
          consciousness: formData.consciousness,
          massiveBleeding: formData.massiveBleeding,
          respiratoryDistress: formData.respiratoryDistress,
          riskFactors: formData.riskFactors,
        };
        
        // Process through our triage model - but don't create a patient
        const prediction = processNewPatient(patientData, false);
        
        // Update preview data for display only
        setPreviewData({
          triageLevel: prediction.triageLevel,
          urgencyPercentage: prediction.urgencyPercentage
        });
        
        // Update state with predictions for display
        setCalculatedTriage(prediction.triageLevel);
        setUrgencyPercentage(prediction.urgencyPercentage);
        
        // Get warnings from patient data
        setWarnings(getPatientWarnings(prediction));
      }
    } catch (error) {
      console.error("Error calculating triage level:", error);
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting || isLoading) {
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // Format data for processing
      const patientData = {
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        chestPainType: parseInt(formData.chestPainType || '0', 10),
        cholesterol: parseInt(formData.cholesterol || '0', 10),
        exerciseAngina: formData.exerciseAngina ? 1 : 0,
        plasmaGlucose: parseInt(formData.plasmaGlucose || '0', 10),
        skinThickness: parseInt(formData.skinThickness || '0', 10),
        bmi: parseFloat(formData.bmi || '0'),
        hypertension: formData.hypertension ? 1 : 0,
        heartDisease: formData.heartDisease ? 1 : 0,
        residenceType: formData.residenceType,
        smokingStatus: formData.smokingStatus,
        symptom: formData.symptom,
        temperature: parseFloat(formData.temperature),
        heartRate: parseInt(formData.heartRate, 10),
        respiratoryRate: parseInt(formData.respiratoryRate, 10),
        bloodPressure: `${formData.bloodPressureSys || '0'}/${formData.bloodPressureDia || '0'}`,
        spO2: parseInt(formData.spO2, 10),
        glasgowScore: parseInt(formData.glasgowScore, 10),
        consciousness: formData.consciousness,
        massiveBleeding: formData.massiveBleeding,
        respiratoryDistress: formData.respiratoryDistress,
        riskFactors: formData.riskFactors,
      };
      
      // Process through our ML model, passing true to actually create a patient
      const patient = processNewPatient(patientData, true);
      
      // Add patient to Supabase
      await addPatientToSupabase(patient);
      
      // Append the patient to the CSV (local storage)
      try {
        const csvRow = appendPatientToCSV(patient);
        const currentCSV = localStorage.getItem('patientCSV') || '';
        
        // If first entry, add headers
        if (!currentCSV) {
          const headers = 'id,age,gender,chestPainType,cholesterol,exerciseAngina,' +
            'plasmaGlucose,skinThickness,bmi,hypertension,heartDisease,' +
            'residenceType,smokingStatus,symptom,temperature,heartRate,' +
            'respiratoryRate,bloodPressure,spO2,glasgowScore,consciousness,' +
            'massiveBleeding,respiratoryDistress,riskFactors,triageLevel,urgencyPercentage\n';
          localStorage.setItem('patientCSV', headers + csvRow);
        } else {
          localStorage.setItem('patientCSV', currentCSV + csvRow);
        }
      } catch (error) {
        console.error("Error appending to CSV:", error);
      }
      
      console.log("Patient added:", patient);
      
      // Show success message
      toast({
        title: "Patient added successfully",
        description: `Patient ID ${patient.id} has been added with ${patient.triageLevel} priority (${patient.urgencyPercentage}%).`,
      });
      
      // Small delay before redirecting
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitting(false);
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error("Error processing patient data:", error);
      toast({
        title: "Error adding patient",
        description: "There was a problem processing the patient data.",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Add New Patient" />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <PatientFormHeader 
              calculatedTriage={calculatedTriage} 
              urgencyPercentage={urgencyPercentage} 
            />
          </CardHeader>
          <CardContent>
            <PatientWarnings warnings={warnings} />
            
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <PatientFormActions 
                isLoading={isLoading} 
                onCancel={() => navigate('/')} 
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddPatient;
