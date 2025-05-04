
import { supabase } from '@/integrations/supabase/client';
import { Patient } from './types';

// Convert Patient object to Supabase format (camelCase to snake_case)
const patientToSupabaseFormat = (patient: Patient) => {
  return {
    id: patient.id,
    age: patient.age,
    gender: patient.gender,
    chestpaintype: patient.chestPainType,
    cholesterol: patient.cholesterol,
    exerciseangina: patient.exerciseAngina,
    plasmaglucose: patient.plasmaGlucose,
    skinthickness: patient.skinThickness,
    bmi: patient.bmi,
    hypertension: patient.hypertension,
    heartdisease: patient.heartDisease,
    residencetype: patient.residenceType,
    smokingstatus: patient.smokingStatus,
    symptom: patient.symptom,
    temperature: patient.temperature,
    heartrate: patient.heartRate,
    respiratoryrate: patient.respiratoryRate,
    bloodpressure: patient.bloodPressure,
    spo2: patient.spO2,
    glasgowscore: patient.glasgowScore,
    consciousness: patient.consciousness,
    massivebleeding: patient.massiveBleeding,
    respiratorydistress: patient.respiratoryDistress,
    riskfactors: patient.riskFactors,
    triagelevel: patient.triageLevel,
    urgencypercentage: patient.urgencyPercentage
  };
};

// Convert Supabase format to Patient object (snake_case to camelCase)
const supabaseFormatToPatient = (supabasePatient: any): Patient => {
  return {
    id: supabasePatient.id,
    age: supabasePatient.age,
    gender: supabasePatient.gender,
    chestPainType: supabasePatient.chestpaintype,
    cholesterol: supabasePatient.cholesterol,
    exerciseAngina: supabasePatient.exerciseangina,
    plasmaGlucose: supabasePatient.plasmaglucose,
    skinThickness: supabasePatient.skinthickness,
    bmi: supabasePatient.bmi,
    hypertension: supabasePatient.hypertension,
    heartDisease: supabasePatient.heartdisease,
    residenceType: supabasePatient.residencetype,
    smokingStatus: supabasePatient.smokingstatus,
    symptom: supabasePatient.symptom,
    temperature: supabasePatient.temperature,
    heartRate: supabasePatient.heartrate,
    respiratoryRate: supabasePatient.respiratoryrate,
    bloodPressure: supabasePatient.bloodpressure,
    spO2: supabasePatient.spo2,
    glasgowScore: supabasePatient.glasgowscore,
    consciousness: supabasePatient.consciousness,
    massiveBleeding: supabasePatient.massivebleeding,
    respiratoryDistress: supabasePatient.respiratorydistress,
    riskFactors: supabasePatient.riskfactors,
    triageLevel: supabasePatient.triagelevel as "critical" | "emergency" | "urgent" | "standard" | "nonurgent",
    urgencyPercentage: supabasePatient.urgencypercentage
  };
};

// Function to sync patients with Supabase
export const syncPatientsWithSupabase = async (patients: Patient[]): Promise<void> => {
  try {
    // First clear existing data to avoid duplicates
    await supabase.from('patients').delete().neq('id', 0);
    
    // Convert each patient to Supabase format and insert
    const supabaseFormatPatients = patients.map(patientToSupabaseFormat);
    const { error } = await supabase.from('patients').insert(supabaseFormatPatients);
    
    if (error) {
      console.error('Error syncing patients with Supabase:', error);
    }
  } catch (err) {
    console.error('Error in syncPatientsWithSupabase:', err);
  }
};

// Function to fetch patients from Supabase
export const fetchPatientsFromSupabase = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('id');
      
    if (error) {
      console.error('Error fetching patients from Supabase:', error);
      return [];
    }
    
    // Convert each Supabase format patient to Patient type
    return data.map(supabaseFormatToPatient);
  } catch (err) {
    console.error('Error in fetchPatientsFromSupabase:', err);
    return [];
  }
};

// Function to skip (delete) a patient in Supabase
export const skipPatientInSupabase = async (patientId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', parseInt(patientId));
      
    if (error) {
      console.error('Error skipping patient in Supabase:', error);
    }
  } catch (err) {
    console.error('Error in skipPatientInSupabase:', err);
  }
};

// Function to export patients from Supabase as CSV
export const exportPatientsFromSupabase = async (): Promise<Patient[]> => {
  return await fetchPatientsFromSupabase();
};
