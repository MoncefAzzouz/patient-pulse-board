
import { Patient } from '../utils/types';

// PatientSummary interface
export interface PatientSummary {
  critical: { count: number, patients: Patient[] };
  emergency: { count: number, patients: Patient[] };
  urgent: { count: number, patients: Patient[] };
  standard: { count: number, patients: Patient[] };
  nonurgent: { count: number, patients: Patient[] };
}

// Props for the TriageSummary component
export interface TriageSummaryProps {
  patientSummary: PatientSummary;
}

// Props for the Dashboard component
export interface DashboardProps {
  // Add any props if needed
}
