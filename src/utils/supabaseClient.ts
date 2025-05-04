
import { supabase } from '@/integrations/supabase/client';
import { Patient } from './types';

// Function to sync patients with Supabase
export const syncPatientsWithSupabase = async (patients: Patient[]): Promise<void> => {
  try {
    // First clear existing data to avoid duplicates
    await supabase.from('patients').delete().neq('id', 0);
    
    // Insert all patients
    const { error } = await supabase.from('patients').insert(patients);
    
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
    
    return data as Patient[];
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
