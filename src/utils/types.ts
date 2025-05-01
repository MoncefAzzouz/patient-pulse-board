
export type TriageLevel = 'critical' | 'emergency' | 'urgent' | 'standard' | 'nonurgent';

export interface Patient {
  id: number;
  age: number;
  gender: string;
  chestPainType: number;
  cholesterol: number;
  exerciseAngina: number;
  plasmaGlucose: number;
  skinThickness: number;
  bmi: number;
  hypertension: number;
  heartDisease: number;
  residenceType: string;
  smokingStatus: string;
  symptom: string;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  bloodPressure: string;
  spO2: number;
  glasgowScore: number;
  consciousness: string;
  massiveBleeding: boolean;
  respiratoryDistress: boolean;
  riskFactors: string;
  triageLevel: TriageLevel;
  urgencyPercentage: number;
}

export interface User {
  username: string;
  password: string;
  name: string;
}

export interface PatientFormData {
  age: string;
  gender: string;
  chestPainType: string;
  cholesterol: string;
  exerciseAngina: boolean;
  plasmaGlucose: string;
  skinThickness: string;
  bmi: string;
  hypertension: boolean;
  heartDisease: boolean;
  residenceType: string;
  smokingStatus: string;
  symptom: string;
  temperature: string;
  heartRate: string;
  respiratoryRate: string;
  bloodPressureSys: string;
  bloodPressureDia: string;
  spO2: string;
  glasgowScore: string;
  consciousness: string;
  massiveBleeding: boolean;
  respiratoryDistress: boolean;
  riskFactors: string;
}
