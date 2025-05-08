
import { useState, useEffect } from 'react';
import { Patient } from '../utils/types';
import { fetchPatientsFromSupabase, deletePatientFromSupabase } from '../utils/supabasePatients';
import { toast } from "sonner";

// Type for the patient summary object
interface PatientSummary {
  critical: { count: number, patients: Patient[] };
  emergency: { count: number, patients: Patient[] };
  urgent: { count: number, patients: Patient[] };
  standard: { count: number, patients: Patient[] };
  nonurgent: { count: number, patients: Patient[] };
}

// Function to organize patients by triage level
const organizePatientsByTriage = (patientList: Patient[]): PatientSummary => {
  const summary = {
    critical: { count: 0, patients: [] as Patient[] },
    emergency: { count: 0, patients: [] as Patient[] },
    urgent: { count: 0, patients: [] as Patient[] },
    standard: { count: 0, patients: [] as Patient[] },
    nonurgent: { count: 0, patients: [] as Patient[] }
  };

  patientList.forEach(patient => {
    if (summary[patient.triageLevel]) {
      summary[patient.triageLevel].patients.push(patient);
      summary[patient.triageLevel].count++;
    }
  });

  // Sort patients in each category by urgency percentage (descending)
  Object.keys(summary).forEach(level => {
    if (summary[level].patients && Array.isArray(summary[level].patients)) {
      summary[level].patients.sort((a: Patient, b: Patient) => 
        b.urgencyPercentage - a.urgencyPercentage
      );
    }
  });

  return summary;
};

// Custom hook for managing patients
export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientSummary, setPatientSummary] = useState<PatientSummary>({
    critical: { count: 0, patients: [] },
    emergency: { count: 0, patients: [] },
    urgent: { count: 0, patients: [] },
    standard: { count: 0, patients: [] },
    nonurgent: { count: 0, patients: [] }
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      // Fetch patients from Supabase
      const supabasePatients = await fetchPatientsFromSupabase();
      
      // Convert field names from lowercase (Supabase) to camelCase (Frontend)
      const formattedPatients = supabasePatients.map(patient => ({
        id: patient.id,
        age: patient.age,
        gender: patient.gender,
        chestPainType: patient.chestpaintype,
        cholesterol: patient.cholesterol,
        exerciseAngina: patient.exerciseangina,
        plasmaGlucose: patient.plasmaglucose,
        skinThickness: patient.skinthickness,
        bmi: patient.bmi,
        hypertension: patient.hypertension,
        heartDisease: patient.heartdisease,
        residenceType: patient.residencetype,
        smokingStatus: patient.smokingstatus,
        symptom: patient.symptom,
        temperature: patient.temperature,
        heartRate: patient.heartrate,
        respiratoryRate: patient.respiratoryrate,
        bloodPressure: patient.bloodpressure,
        spO2: patient.spo2,
        glasgowScore: patient.glasgowscore,
        consciousness: patient.consciousness,
        massiveBleeding: patient.massivebleeding,
        respiratoryDistress: patient.respiratorydistress,
        riskFactors: patient.riskfactors,
        triageLevel: patient.triagelevel,
        urgencyPercentage: patient.urgencypercentage
      }));

      console.log("Loaded patients from Supabase:", formattedPatients.length);
      
      // Set state with the fetched patients
      setPatients(formattedPatients);
      
      // Organize patients by triage level
      const summary = organizePatientsByTriage(formattedPatients);
      setPatientSummary(summary);
      
      // Also save to localStorage for offline backup
      localStorage.setItem('patients', JSON.stringify(formattedPatients));
      localStorage.setItem('patientSummary', JSON.stringify(summary));
    } catch (error) {
      console.error("Error loading patients from Supabase:", error);
      toast.error("Failed to load patients. Using local data if available.");
      
      // Fallback to localStorage if Supabase fails
      const storedPatients = localStorage.getItem('patients');
      const storedSummary = localStorage.getItem('patientSummary');
      
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
      
      if (storedSummary) {
        setPatientSummary(JSON.parse(storedSummary));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientDone = async (patient: Patient) => {
    try {
      // Remove patient from Supabase
      await deletePatientFromSupabase(patient.id);
      
      // Remove patient from the local patients array
      const updatedPatients = patients.filter(p => p.id !== patient.id);
      
      // Update patient summary
      const updatedSummary = {...patientSummary};
      updatedSummary[patient.triageLevel].patients = updatedSummary[patient.triageLevel].patients.filter(
        (p: Patient) => p.id !== patient.id
      );
      updatedSummary[patient.triageLevel].count--;
      
      // Save updated data to localStorage as backup
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      localStorage.setItem('patientSummary', JSON.stringify(updatedSummary));
      
      // Update state
      setPatients(updatedPatients);
      setPatientSummary(updatedSummary);
      
      // Show confirmation toast
      toast.success(`Patient ${patient.id} has been marked as done.`);
    } catch (error) {
      console.error("Error removing patient:", error);
      toast.error("Failed to remove patient. Please try again.");
    }
  };

  useEffect(() => {
    // Load patients from Supabase
    loadPatients();
    
    // Set up event listener for storage changes (for real-time updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'patients' || e.key === 'patientSummary') {
        console.log("Storage changed, reloading patients");
        loadPatients();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Add a custom event listener for our app's updates
    const handleCustomEvent = () => {
      console.log("Custom event triggered, reloading patients");
      loadPatients();
    };
    
    window.addEventListener('patientDataUpdated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('patientDataUpdated', handleCustomEvent);
    };
  }, []);

  return {
    patients,
    patientSummary,
    isLoading,
    loadPatients,
    handlePatientDone
  };
};
