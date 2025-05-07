
// Import types
import { Patient, TriageLevel } from './types';

// Calculate triage level based on patient data
export const processNewPatient = (patientData: any, createPatient: boolean = true): Patient => {
  // Extract vital signs for triage calculation
  const { 
    age, temperature, heartRate, respiratoryRate, spO2, glasgowScore, 
    massiveBleeding, respiratoryDistress, consciousness,
    hypertension, heartDisease, cholesterol
  } = patientData;
  
  // Get the next patient ID
  const nextId = createPatient ? getNextPatientId() : 0;
  
  // Calculate base triage score (from 0-100)
  let urgencyScore = 0;
  
  // Massive bleeding is automatically critical
  if (massiveBleeding) {
    urgencyScore = 95;
  }
  // Respiratory distress is high priority
  else if (respiratoryDistress) {
    urgencyScore = Math.max(urgencyScore, 85);
  }
  
  // Process vital signs
  // Temperature
  if (temperature > 39 || temperature < 35) {
    urgencyScore = Math.max(urgencyScore, 75);
  } else if (temperature > 38 || temperature < 36) {
    urgencyScore = Math.max(urgencyScore, 60);
  }
  
  // Heart rate
  if (heartRate > 130 || heartRate < 50) {
    urgencyScore = Math.max(urgencyScore, 80);
  } else if (heartRate > 110 || heartRate < 60) {
    urgencyScore = Math.max(urgencyScore, 65);
  }
  
  // Respiratory rate
  if (respiratoryRate > 30 || respiratoryRate < 8) {
    urgencyScore = Math.max(urgencyScore, 85);
  } else if (respiratoryRate > 25 || respiratoryRate < 10) {
    urgencyScore = Math.max(urgencyScore, 70);
  }
  
  // SpO2
  if (spO2 < 90) {
    urgencyScore = Math.max(urgencyScore, 90);
  } else if (spO2 < 94) {
    urgencyScore = Math.max(urgencyScore, 70);
  }
  
  // Glasgow Coma Scale
  if (glasgowScore < 9) {
    urgencyScore = Math.max(urgencyScore, 95);
  } else if (glasgowScore < 13) {
    urgencyScore = Math.max(urgencyScore, 75);
  } else if (glasgowScore < 15) {
    urgencyScore = Math.max(urgencyScore, 45);
  }
  
  // Consciousness
  if (consciousness === "Unresponsive") {
    urgencyScore = Math.max(urgencyScore, 95);
  } else if (consciousness === "Responsive to pain") {
    urgencyScore = Math.max(urgencyScore, 80);
  } else if (consciousness === "Verbal response") {
    urgencyScore = Math.max(urgencyScore, 60);
  }
  
  // Age factor (elderly and very young get higher priority)
  if (age > 85 || age < 2) {
    urgencyScore += 15;
  } else if (age > 70 || age < 10) {
    urgencyScore += 10;
  }
  
  // Cardiac conditions adjustment
  if (hypertension && heartDisease) {
    urgencyScore += 15;
  } else if (hypertension || heartDisease) {
    urgencyScore += 8;
  }
  
  // High cholesterol
  if (cholesterol > 240) {
    urgencyScore += 5;
  }
  
  // Cap the score at 100
  urgencyScore = Math.min(urgencyScore, 100);
  
  // Determine triage level based on urgency score
  let triageLevel: TriageLevel;
  if (urgencyScore >= 85) {
    triageLevel = 'critical';
  } else if (urgencyScore >= 70) {
    triageLevel = 'emergency';
  } else if (urgencyScore >= 50) {
    triageLevel = 'urgent';
  } else if (urgencyScore >= 30) {
    triageLevel = 'standard';
  } else {
    triageLevel = 'nonurgent';
  }
  
  // Create a patient object with all data
  const patient: Patient = {
    id: nextId,
    ...patientData,
    triageLevel,
    urgencyPercentage: Math.round(urgencyScore),
  };

  return patient;
};

// Function to get the next patient ID
export const getNextPatientId = (): number => {
  // Get existing patients from local storage
  const patientsCSV = localStorage.getItem('patientCSV') || '';
  
  // If no patients exist yet, start with ID 1
  if (!patientsCSV || patientsCSV.split('\n').length <= 1) {
    return 1;
  }
  
  // Parse the CSV to get the highest ID
  const lines = patientsCSV.trim().split('\n');
  let maxId = 0;
  
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

// Function to get warning messages based on patient data
export const getPatientWarnings = (patient: Patient): string[] => {
  const warnings: string[] = [];
  
  // Check vital signs
  if (patient.temperature > 39) {
    warnings.push(`High fever (${patient.temperature}°C)`);
  } else if (patient.temperature < 36) {
    warnings.push(`Low body temperature (${patient.temperature}°C)`);
  }
  
  if (patient.heartRate > 120) {
    warnings.push(`Tachycardia - elevated heart rate (${patient.heartRate} bpm)`);
  } else if (patient.heartRate < 55) {
    warnings.push(`Bradycardia - low heart rate (${patient.heartRate} bpm)`);
  }
  
  if (patient.respiratoryRate > 25) {
    warnings.push(`Tachypnea - rapid breathing (${patient.respiratoryRate} breaths/min)`);
  } else if (patient.respiratoryRate < 10) {
    warnings.push(`Bradypnea - slow breathing (${patient.respiratoryRate} breaths/min)`);
  }
  
  if (patient.spO2 < 95) {
    warnings.push(`Low blood oxygen saturation (${patient.spO2}%)`);
  }
  
  // Glasgow score warning
  if (patient.glasgowScore < 15) {
    warnings.push(`Reduced consciousness level (Glasgow score: ${patient.glasgowScore})`);
  }
  
  // Critical conditions
  if (patient.massiveBleeding) {
    warnings.push('Massive bleeding detected');
  }
  
  if (patient.respiratoryDistress) {
    warnings.push('Respiratory distress');
  }
  
  if (patient.consciousness !== 'Awake') {
    warnings.push(`Altered consciousness state: ${patient.consciousness}`);
  }
  
  // Cardiac warnings
  if (patient.heartDisease) {
    warnings.push('Pre-existing heart disease');
  }
  
  if (patient.hypertension) {
    warnings.push('Hypertension');
  }
  
  if (patient.cholesterol > 240) {
    warnings.push(`High cholesterol levels (${patient.cholesterol} mg/dL)`);
  }
  
  return warnings;
};

// New function to update patient summary after adding a new patient
export const updatePatientSummary = (newPatient: Patient): void => {
  try {
    // Get existing patient summary
    const storedSummary = localStorage.getItem('patientSummary');
    let patientSummary = storedSummary ? JSON.parse(storedSummary) : {
      critical: { count: 0, patients: [] },
      emergency: { count: 0, patients: [] },
      urgent: { count: 0, patients: [] },
      standard: { count: 0, patients: [] },
      nonurgent: { count: 0, patients: [] }
    };
    
    // Get existing patients
    const storedPatients = localStorage.getItem('patients');
    let patients = storedPatients ? JSON.parse(storedPatients) : [];
    
    // Add new patient to the patients array
    patients.push(newPatient);
    
    // Add the patient to the appropriate triage level in the summary
    patientSummary[newPatient.triageLevel].patients.push(newPatient);
    patientSummary[newPatient.triageLevel].count++;
    
    // Save updated patients and summary to localStorage
    localStorage.setItem('patients', JSON.stringify(patients));
    localStorage.setItem('patientSummary', JSON.stringify(patientSummary));
    
    // Dispatch an event to notify the dashboard to reload data
    window.dispatchEvent(new CustomEvent('patientDataUpdated'));
    
    console.log(`Patient ${newPatient.id} added to ${newPatient.triageLevel} level.`);
  } catch (error) {
    console.error("Error updating patient summary:", error);
  }
};
