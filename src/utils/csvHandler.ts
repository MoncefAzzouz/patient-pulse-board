
import { Patient } from './types';
import { processNewPatient } from './triageModel';
import { addPatientToSupabase } from './supabasePatients';
import { toast } from "sonner";

// Function to add patients from a dataset to the local database
export const addPatientsToDatabase = (patients: Patient[]): void => {
  try {
    // Get existing CSV data
    const existingCSV = localStorage.getItem('patientCSV') || '';
    const lines = existingCSV.trim().split('\n');
    
    // If only header exists, start fresh
    let csvData = existingCSV;
    if (lines.length <= 1) {
      csvData = 'id,age,gender,chestPainType,cholesterol,exerciseAngina,' +
        'plasmaGlucose,skinThickness,bmi,hypertension,heartDisease,' +
        'residenceType,smokingStatus,symptom,temperature,heartRate,' +
        'respiratoryRate,bloodPressure,spO2,glasgowScore,consciousness,' +
        'massiveBleeding,respiratoryDistress,riskFactors,triageLevel,urgencyPercentage\n';
    }
    
    // Add each patient as a new row in CSV
    patients.forEach(patient => {
      csvData += `${patient.id},${patient.age},${patient.gender},${patient.chestPainType},${patient.cholesterol},${patient.exerciseAngina},` +
        `${patient.plasmaGlucose},${patient.skinThickness},${patient.bmi},${patient.hypertension},${patient.heartDisease},` +
        `${patient.residenceType},${patient.smokingStatus},${patient.symptom},${patient.temperature},${patient.heartRate},` +
        `${patient.respiratoryRate},${patient.bloodPressure},${patient.spO2},${patient.glasgowScore},${patient.consciousness},` +
        `${patient.massiveBleeding},${patient.respiratoryDistress},${patient.riskFactors || ''},${patient.triageLevel},${patient.urgencyPercentage}\n`;
    });
    
    // Save to localStorage
    localStorage.setItem('patientCSV', csvData);
    
    // Update the patient summary
    // Dispatch a custom event to trigger the dashboard to reload
    window.dispatchEvent(new CustomEvent('patientDataUpdated'));
  } catch (error) {
    console.error("Error adding patients to database:", error);
  }
};

// Function to parse CSV data into Patient objects
export const parseCSVData = (csvData: string): Patient[] => {
  try {
    const lines = csvData.trim().split('\n');
    
    // Need at least header plus one row
    if (lines.length < 2) {
      throw new Error("Invalid CSV format: no data rows found");
    }
    
    const patients: Patient[] = [];
    let nextId = getNextPatientId();
    
    // Process each data row (skip header row)
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      
      // Basic validation
      if (row.length < 10) {
        console.warn(`Skipping row ${i+1}: insufficient data`);
        continue;
      }
      
      try {
        // Extract basic data
        const age = parseInt(row[1], 10) || Math.floor(Math.random() * 50 + 20);
        const gender = row[2] || (Math.random() > 0.5 ? 'Male' : 'Female');
        
        // Health indicators with defaults
        const chestPainType = parseInt(row[3], 10) || Math.floor(Math.random() * 4);
        const cholesterol = parseInt(row[4], 10) || Math.floor(Math.random() * 150 + 150);
        const exerciseAngina = parseInt(row[5], 10) || Math.floor(Math.random() * 2);
        const plasmaGlucose = parseInt(row[6], 10) || Math.floor(Math.random() * 100 + 70);
        const skinThickness = parseInt(row[7], 10) || Math.floor(Math.random() * 30 + 10);
        const bmi = parseFloat(row[8]) || (Math.random() * 15 + 20).toFixed(1);
        const hypertension = parseInt(row[9], 10) || Math.floor(Math.random() * 2);
        const heartDisease = parseInt(row[10], 10) || Math.floor(Math.random() * 2);
        
        // Demographic data
        const residenceType = row[11] || (Math.random() > 0.7 ? 'Rural' : 'Urban');
        const smokingStatus = row[12] || (['Never', 'Former', 'Current'])[Math.floor(Math.random() * 3)];
        
        // Clinical data
        const symptom = row[13] || (['Chest Pain', 'Shortness of Breath', 'Fever', 'Headache', 'Abdominal Pain'])[Math.floor(Math.random() * 5)];
        const temperature = parseFloat(row[14]) || (36 + Math.random() * 3).toFixed(1);
        const heartRate = parseInt(row[15], 10) || Math.floor(Math.random() * 50 + 60);
        const respiratoryRate = parseInt(row[16], 10) || Math.floor(Math.random() * 10 + 12);
        const bloodPressure = row[17] || `${Math.floor(Math.random() * 40 + 110)}/${Math.floor(Math.random() * 30 + 60)}`;
        const spO2 = parseFloat(row[18]) || Math.floor(Math.random() * 10 + 90);
        const glasgowScore = parseFloat(row[19]) || Math.floor(Math.random() * 3 + 13);
        
        // Consciousness and critical indicators
        const consciousness = row[20] || (['Awake', 'Verbal response', 'Responsive to pain', 'Unresponsive'])[Math.floor(Math.random() * 4)];
        const massiveBleeding = row[21] === 'true' || Math.random() < 0.05;
        const respiratoryDistress = row[22] === 'true' || Math.random() < 0.1;
        
        // Risk factors
        const riskFactors = row[23] || '';
        
        // Process the patient data to calculate triage level and urgency
        const patientData = {
          age,
          gender,
          chestPainType,
          cholesterol,
          exerciseAngina,
          plasmaGlucose,
          skinThickness,
          bmi,
          hypertension,
          heartDisease,
          residenceType,
          smokingStatus,
          symptom,
          temperature,
          heartRate,
          respiratoryRate,
          bloodPressure,
          spO2,
          glasgowScore,
          consciousness,
          massiveBleeding,
          respiratoryDistress,
          riskFactors
        };
        
        // Create a new patient with a unique ID and calculated triage level
        const patient = processNewPatient({...patientData, id: nextId++}, false);
        
        // Add to Supabase
        addPatientToSupabase(patient)
          .then(() => {
            console.log(`Patient ${patient.id} added to Supabase`);
          })
          .catch(error => {
            console.error(`Error adding patient ${patient.id} to Supabase:`, error);
            toast.error(`Failed to add patient ${patient.id} to database`);
          });
        
        patients.push(patient);
      } catch (error) {
        console.error(`Error processing row ${i+1}:`, error);
      }
    }
    
    return patients;
  } catch (error) {
    console.error("Error parsing CSV data:", error);
    throw new Error(`Failed to parse CSV data: ${error.message}`);
  }
};

// Function to get the next unique patient ID
export const getNextPatientId = (): number => {
  // Get existing patients from localStorage
  const storedPatients = localStorage.getItem('patients');
  let maxId = 0;
  
  if (storedPatients) {
    const patients = JSON.parse(storedPatients);
    
    // Find the maximum ID
    patients.forEach((patient: Patient) => {
      if (patient.id > maxId) {
        maxId = patient.id;
      }
    });
  }
  
  // Also check CSV data for IDs
  const patientsCSV = localStorage.getItem('patientCSV') || '';
  const lines = patientsCSV.trim().split('\n');
  
  // Skip header row and find maximum ID
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    if (row.length > 0) {
      const id = parseInt(row[0], 10);
      if (!isNaN(id) && id > maxId) {
        maxId = id;
      }
    }
  }
  
  // Return next ID (max + 1)
  return maxId + 1;
};
