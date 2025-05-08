
import { Patient } from '../utils/types';
import { supabase } from "@/integrations/supabase/client";

// Function to fetch all patients from Supabase
export const fetchPatientsFromSupabase = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data as Patient[];
  } catch (error) {
    console.error('Error fetching patients from Supabase:', error);
    return [];
  }
};

// Function to add a patient to Supabase
export const addPatientToSupabase = async (patient: Patient): Promise<void> => {
  try {
    // Format patient data to match Supabase column names (all lowercase)
    const patientData = {
      id: patient.id,
      age: patient.age,
      temperature: patient.temperature,
      heartrate: patient.heartRate,
      respiratoryrate: patient.respiratoryRate,
      spo2: patient.spO2,
      glasgowscore: patient.glasgowScore,
      massivebleeding: patient.massiveBleeding,
      respiratorydistress: patient.respiratoryDistress,
      urgencypercentage: patient.urgencyPercentage,
      chestpaintype: patient.chestPainType,
      cholesterol: patient.cholesterol,
      exerciseangina: patient.exerciseAngina,
      plasmaglucose: patient.plasmaGlucose,
      skinthickness: patient.skinThickness,
      bmi: patient.bmi,
      hypertension: patient.hypertension,
      heartdisease: patient.heartDisease,
      gender: patient.gender,
      bloodpressure: patient.bloodPressure,
      residencetype: patient.residenceType,
      smokingstatus: patient.smokingStatus,
      symptom: patient.symptom,
      riskfactors: patient.riskFactors,
      triagelevel: patient.triageLevel,
      consciousness: patient.consciousness
    };

    const { error } = await supabase
      .from('patients')
      .insert(patientData);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error adding patient to Supabase:', error);
    throw error;
  }
};

// Function to update a patient in Supabase
export const updatePatientInSupabase = async (patient: Patient): Promise<void> => {
  try {
    // Format patient data to match Supabase column names (all lowercase)
    const patientData = {
      age: patient.age,
      temperature: patient.temperature,
      heartrate: patient.heartRate,
      respiratoryrate: patient.respiratoryRate,
      spo2: patient.spO2,
      glasgowscore: patient.glasgowScore,
      massivebleeding: patient.massiveBleeding,
      respiratorydistress: patient.respiratoryDistress,
      urgencypercentage: patient.urgencyPercentage,
      chestpaintype: patient.chestPainType,
      cholesterol: patient.cholesterol,
      exerciseangina: patient.exerciseAngina,
      plasmaglucose: patient.plasmaGlucose,
      skinthickness: patient.skinThickness,
      bmi: patient.bmi,
      hypertension: patient.hypertension,
      heartdisease: patient.heartDisease,
      gender: patient.gender,
      bloodpressure: patient.bloodPressure,
      residencetype: patient.residenceType,
      smokingstatus: patient.smokingStatus,
      symptom: patient.symptom,
      riskfactors: patient.riskFactors,
      triagelevel: patient.triageLevel,
      consciousness: patient.consciousness
    };

    const { error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', patient.id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating patient in Supabase:', error);
    throw error;
  }
};

// Function to delete a patient from Supabase
export const deletePatientFromSupabase = async (patientId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting patient from Supabase:', error);
    throw error;
  }
};

// Function to add multiple patients from a dataset
export const addPatientsToSupabase = async (patients: Patient[]): Promise<number> => {
  try {
    // Format all patients data to match Supabase column names
    const formattedPatients = patients.map(patient => ({
      id: patient.id,
      age: patient.age,
      temperature: patient.temperature,
      heartrate: patient.heartRate,
      respiratoryrate: patient.respiratoryRate,
      spo2: patient.spO2,
      glasgowscore: patient.glasgowScore,
      massivebleeding: patient.massiveBleeding,
      respiratorydistress: patient.respiratoryDistress,
      urgencypercentage: patient.urgencyPercentage,
      chestpaintype: patient.chestPainType,
      cholesterol: patient.cholesterol,
      exerciseangina: patient.exerciseAngina,
      plasmaglucose: patient.plasmaGlucose,
      skinthickness: patient.skinThickness,
      bmi: patient.bmi,
      hypertension: patient.hypertension,
      heartdisease: patient.heartDisease,
      gender: patient.gender,
      bloodpressure: patient.bloodPressure,
      residencetype: patient.residenceType,
      smokingstatus: patient.smokingStatus,
      symptom: patient.symptom,
      riskfactors: patient.riskFactors,
      triagelevel: patient.triageLevel,
      consciousness: patient.consciousness
    }));

    const { data, error } = await supabase
      .from('patients')
      .insert(formattedPatients)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data ? data.length : 0;
  } catch (error) {
    console.error('Error adding patients to Supabase:', error);
    return 0;
  }
};
