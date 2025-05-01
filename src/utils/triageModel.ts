
import { Patient, TriageLevel } from './types';

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
 * This is a simplified version of the model logic implemented in Python
 * @param patient The patient data to evaluate
 * @returns A prediction object with triage level and urgency percentage
 */
export function predictTriageLevel(patient: Patient): { 
  triageLevel: TriageLevel; 
  urgencyPercentage: number;
} {
  let triageScore = 0;
  
  // Critical conditions first (highest priority)
  if (patient.massiveBleeding || 
      patient.spO2 < 90 || 
      patient.glasgowScore < 9 ||
      patient.consciousness === 'Unresponsive') {
    return {
      triageLevel: 'critical',
      urgencyPercentage: calculateUrgencyPercentage('critical', patient)
    };
  }
  
  // Emergency conditions
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
  
  // Urgent conditions
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
  
  // Non-urgent conditions
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
 * This mimics the priority score calculation from the Python model
 * @param triageLevel The assigned triage level
 * @param patient The patient data
 * @returns A number between 0-100 representing urgency percentage
 */
function calculateUrgencyPercentage(triageLevel: TriageLevel, patient: Patient): number {
  let score = 0;
  
  // Base scores by triage level
  const baseScores: Record<TriageLevel, number> = {
    'critical': 85,
    'emergency': 70,
    'urgent': 55,
    'standard': 40,
    'nonurgent': 20
  };

  // Start with base score for this triage level
  score = baseScores[triageLevel];
  
  // Add points for vitals outside normal ranges
  if (patient.cholesterol > 240) score += 3;
  if (patient.plasmaGlucose > 120) score += 3;
  if (patient.bmi > 30 || patient.bmi < 18.5) score += 2;
  
  // Temperature effects
  if (patient.temperature < 35) score += 5;
  else if (patient.temperature > 38) score += 3;
  
  // Heart Rate
  if (patient.heartRate > 120) score += 5;
  else if (patient.heartRate < 60) score += 3;
  
  // Oxygen Saturation
  if (patient.spO2 < 90) score += 7;
  else if (patient.spO2 < 95) score += 4;
  
  // Glasgow Score
  if (patient.glasgowScore <= 8) score += 7;
  else if (patient.glasgowScore < 13) score += 4;
  
  // Age factor
  if (patient.age > 70) score += 4;
  else if (patient.age > 50) score += 2;
  
  // Limit score to 98 (we never want to show 100% as that suggests no room for higher priority)
  return Math.min(Math.round(score), 98);
}

/**
 * Custom hook to analyze patient data and determine if there are any warnings
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

  return warnings;
}

/**
 * Integration function to handle a new patient submission
 * In a real application, this would send the data to the Python backend
 * @param patientData The form data for a new patient
 * @returns The processed patient with triage level and urgency percentage
 */
export function processNewPatient(patientData: Omit<Patient, 'id' | 'triageLevel' | 'urgencyPercentage'>): Patient {
  // Generate a simple ID (in a real app this would come from the backend)
  const id = Math.floor(Math.random() * 10000);
  
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
  
  // In a real implementation, we would save this to the backend
  // For now, we'll just return the processed patient
  return patient;
}
