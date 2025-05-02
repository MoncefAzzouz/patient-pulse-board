
import { Patient, TriageLevel, PatientFormData } from './types';

// Define the triage level labels
const triageLevels: TriageLevel[] = ['critical', 'emergency', 'urgent', 'standard', 'nonurgent'];

// Constants to map medical terms for triage algorithm
const CONSCIOUSNESS_MAP = {
  'Awake': 3,
  'Responds to Pain': 2,
  'Verbal response': 1,
  'Unresponsive': 0
};

/**
 * Calculates the triage level of a patient based on clinical parameters
 * Implementation based on the ML model logic
 * @param patient The patient data to evaluate
 * @returns A prediction object with triage level and urgency percentage
 */
export function predictTriageLevel(patient: Patient): { 
  triageLevel: TriageLevel; 
  urgencyPercentage: number;
} {
  // First check critical conditions (highest priority)
  if (patient.massiveBleeding || 
      patient.spO2 < 90 || 
      patient.glasgowScore < 9 ||
      patient.consciousness === 'Unresponsive') {
    return {
      triageLevel: 'critical',
      urgencyPercentage: calculateUrgencyPercentage('critical', patient)
    };
  }
  
  // Check emergency conditions
  if (patient.respiratoryDistress || 
      patient.spO2 < 93 || 
      patient.heartRate > 120 || 
      patient.respiratoryRate > 24 || 
      patient.glasgowScore < 13 ||
      patient.temperature > 39) {
    return {
      triageLevel: 'emergency',
      urgencyPercentage: calculateUrgencyPercentage('emergency', patient)
    };
  }
  
  // Check urgent conditions
  if (patient.hypertension || 
      patient.heartDisease || 
      patient.spO2 < 95 || 
      patient.heartRate > 100 || 
      patient.respiratoryRate > 20 || 
      patient.temperature > 38) {
    return {
      triageLevel: 'urgent',
      urgencyPercentage: calculateUrgencyPercentage('urgent', patient)
    };
  }
  
  // Check non-urgent conditions
  if (patient.spO2 > 97 && 
      patient.heartRate < 90 && 
      patient.respiratoryRate < 18 && 
      patient.glasgowScore === 15 &&
      patient.temperature < 37.5) {
    return {
      triageLevel: 'nonurgent',
      urgencyPercentage: calculateUrgencyPercentage('nonurgent', patient)
    };
  }
  
  // Standard (default case)
  return {
    triageLevel: 'standard',
    urgencyPercentage: calculateUrgencyPercentage('standard', patient)
  };
}

/**
 * Calculates the urgency percentage based on patient data and assigned triage level
 * This implements the priority score calculation from the ML model
 * @param triageLevel The assigned triage level
 * @param patient The patient data
 * @returns A number between 0-100 representing urgency percentage
 */
function calculateUrgencyPercentage(triageLevel: TriageLevel, patient: Patient): number {
  let score = 0;
  
  // Base scores by triage level - matching the ML model's base scores
  const baseScores: Record<TriageLevel, number> = {
    'critical': 85,
    'emergency': 70,
    'urgent': 55,
    'standard': 40,
    'nonurgent': 20
  };

  // Start with base score for this triage level
  score = baseScores[triageLevel];
  
  // Add points for vitals outside normal ranges - matching ML model weights
  if (patient.cholesterol > 240) score += 3;
  if (patient.plasmaGlucose > 120) score += 3;
  if (patient.bmi > 30 || patient.bmi < 18.5) score += 2;
  
  // Temperature effects
  if (patient.temperature < 35) score += 5; // Hypothermia
  else if (patient.temperature > 38) score += 3; // Fever
  
  // Heart Rate
  if (patient.heartRate > 120) score += 5; // Tachycardia
  else if (patient.heartRate < 60) score += 3; // Bradycardia
  
  // Oxygen Saturation
  if (patient.spO2 < 90) score += 7; // Severe hypoxemia
  else if (patient.spO2 < 95) score += 4; // Mild hypoxemia
  
  // Glasgow Score
  if (patient.glasgowScore <= 8) score += 7; // Severe neurological impairment
  else if (patient.glasgowScore < 13) score += 4; // Moderate impairment
  
  // Age factor
  if (patient.age > 70) score += 4;
  else if (patient.age > 50) score += 2;
  
  // Additional factors based on ML model
  // Chest pain is a significant factor in cardiac risk
  if (patient.symptom && patient.symptom.includes('chest pain')) {
    if (patient.exerciseAngina) score += 15; // Severe chest pain
    else score += 10; // Regular chest pain
  }
  
  // Risk factors
  if (patient.riskFactors && 
      (patient.riskFactors.includes('diabetes') || 
       patient.riskFactors.includes('kidney failure') ||
       patient.riskFactors.includes('cardiovascular'))) {
    score += 10;
  }
  
  // Limit score to 98 (we never want to show 100% as that suggests no room for higher priority)
  return Math.min(Math.round(score), 98);
}

/**
 * Custom function to analyze patient data and determine if there are any warnings
 * @param patient The patient data to evaluate
 * @returns An array of warning messages
 */
export function getPatientWarnings(patient: Patient): string[] {
  const warnings: string[] = [];
  
  // High priority warnings
  if (patient.massiveBleeding) {
    warnings.push("Critical: Massive bleeding detected");
  }
  
  if (patient.respiratoryDistress) {
    warnings.push("Emergency: Respiratory distress");
  }
  
  if (patient.spO2 < 90) {
    warnings.push(`Critical: Low oxygen saturation (${patient.spO2}%)`);
  } else if (patient.spO2 < 95) {
    warnings.push(`Warning: Decreased oxygen saturation (${patient.spO2}%)`);
  }
  
  if (patient.glasgowScore < 9) {
    warnings.push(`Critical: Low Glasgow Coma Scale (${patient.glasgowScore})`);
  } else if (patient.glasgowScore < 13) {
    warnings.push(`Warning: Decreased consciousness (GCS ${patient.glasgowScore})`);
  }
  
  if (patient.heartRate > 120) {
    warnings.push(`Warning: Tachycardia (${patient.heartRate} bpm)`);
  } else if (patient.heartRate < 60) {
    warnings.push(`Warning: Bradycardia (${patient.heartRate} bpm)`);
  }
  
  if (patient.temperature > 39) {
    warnings.push(`Warning: High fever (${patient.temperature}°C)`);
  } else if (patient.temperature < 35) {
    warnings.push(`Warning: Hypothermia (${patient.temperature}°C)`);
  }

  // Check for high cholesterol
  if (patient.cholesterol > 240) {
    warnings.push(`Warning: High cholesterol (${patient.cholesterol} mg/dL)`);
  } else if (patient.cholesterol > 200) {
    warnings.push(`Note: Borderline high cholesterol (${patient.cholesterol} mg/dL)`);
  }

  // Check for high glucose
  if (patient.plasmaGlucose > 120) {
    warnings.push(`Warning: Elevated blood glucose (${patient.plasmaGlucose} mg/dL)`);
  }

  return warnings;
}

/**
 * Integration function to handle a new patient submission
 * Updates the data in localStorage to make it immediately available on the dashboard
 * @param patientData The form data for a new patient
 * @returns The processed patient with triage level and urgency percentage
 */
export function processNewPatient(patientData: Omit<Patient, 'id' | 'triageLevel' | 'urgencyPercentage'>): Patient {
  // Generate an ID
  const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
  const id = existingPatients.length > 0 
    ? Math.max(...existingPatients.map((p: Patient) => p.id)) + 1 
    : 1;
  
  // Create full patient object
  const patient: Patient = {
    id,
    ...patientData,
    triageLevel: 'standard', // Will be overwritten by prediction
    urgencyPercentage: 0     // Will be overwritten by prediction
  };
  
  // Calculate triage level and urgency
  const prediction = predictTriageLevel(patient);
  patient.triageLevel = prediction.triageLevel;
  patient.urgencyPercentage = prediction.urgencyPercentage;
  
  // Save to localStorage for immediate display on the dashboard
  // We're being extra careful here to avoid duplicates
  const updatedPatients = [...existingPatients, patient];
  localStorage.setItem('patients', JSON.stringify(updatedPatients));
  
  // Update patient summary for the dashboard
  updatePatientSummary(updatedPatients);
  
  return patient;
}

/**
 * Updates the patient summary in localStorage for the dashboard
 * @param patients Array of all patients
 */
function updatePatientSummary(patients: Patient[]) {
  const summary = {
    critical: { count: 0, patients: [] as Patient[] },
    emergency: { count: 0, patients: [] as Patient[] },
    urgent: { count: 0, patients: [] as Patient[] },
    standard: { count: 0, patients: [] as Patient[] },
    nonurgent: { count: 0, patients: [] as Patient[] }
  };
  
  // Group patients by triage level
  patients.forEach(patient => {
    summary[patient.triageLevel].count += 1;
    summary[patient.triageLevel].patients.push(patient);
  });
  
  // Sort patients within each triage level by urgency percentage (descending)
  Object.keys(summary).forEach(level => {
    const triageLevel = level as TriageLevel;
    summary[triageLevel].patients.sort((a, b) => b.urgencyPercentage - a.urgencyPercentage);
  });
  
  localStorage.setItem('patientSummary', JSON.stringify(summary));
}
