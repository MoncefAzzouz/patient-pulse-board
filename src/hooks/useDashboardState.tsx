
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/utils/types';
import { useToast } from '@/hooks/use-toast';

export interface PatientSummary {
  critical: { count: number, patients: Patient[] },
  emergency: { count: number, patients: Patient[] },
  urgent: { count: number, patients: Patient[] },
  standard: { count: number, patients: Patient[] },
  nonurgent: { count: number, patients: Patient[] }
}

export const useDashboardState = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientSummary, setPatientSummary] = useState<PatientSummary>({
    critical: { count: 0, patients: [] },
    emergency: { count: 0, patients: [] },
    urgent: { count: 0, patients: [] },
    standard: { count: 0, patients: [] },
    nonurgent: { count: 0, patients: [] }
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    // Load patients from localStorage
    const loadPatients = () => {
      try {
        console.log("Loading patient data...");
        const storedPatients = localStorage.getItem('patients');
        const storedSummary = localStorage.getItem('patientSummary');
        
        if (storedPatients) {
          const parsedPatients = JSON.parse(storedPatients);
          console.log("Loaded patients:", parsedPatients.length);
          setPatients(parsedPatients);
        }
        
        if (storedSummary) {
          const parsedSummary = JSON.parse(storedSummary);
          setPatientSummary(parsedSummary);
        }
      } catch (error) {
        console.error("Error loading patient data:", error);
      }
    };

    // Load initial data
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
  }, [navigate]);

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleMarkDone = (patientId: number) => {
    try {
      // Remove patient from all data stores
      const updatedPatients = patients.filter(p => p.id !== patientId);
      
      // Update patient summary by recalculating counts
      const newSummary = {
        critical: { count: 0, patients: [] },
        emergency: { count: 0, patients: [] },
        urgent: { count: 0, patients: [] },
        standard: { count: 0, patients: [] },
        nonurgent: { count: 0, patients: [] }
      };
      
      // Rebuild summary from updated patients list
      updatedPatients.forEach(patient => {
        newSummary[patient.triageLevel].patients.push(patient);
        newSummary[patient.triageLevel].count++;
      });
      
      // Update localStorage and state
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      localStorage.setItem('patientSummary', JSON.stringify(newSummary));
      
      // Update state
      setPatients(updatedPatients);
      setPatientSummary(newSummary);
      
      // If the deleted patient was being viewed, close the modal
      if (selectedPatient && selectedPatient.id === patientId) {
        setIsModalOpen(false);
      }
      
      // Show toast
      toast({
        title: "Patient removed",
        description: `Patient ${patientId} has been marked as done and removed.`,
      });
      
    } catch (error) {
      console.error("Error removing patient:", error);
      toast({
        title: "Error",
        description: "Failed to remove patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    try {
      // First remove patient from all collections
      const patientsWithoutUpdated = patients.filter(p => p.id !== updatedPatient.id);
      
      // Add the updated patient
      const updatedPatients = [...patientsWithoutUpdated, updatedPatient];
      
      // Recalculate summary
      const newSummary = {
        critical: { count: 0, patients: [] },
        emergency: { count: 0, patients: [] },
        urgent: { count: 0, patients: [] },
        standard: { count: 0, patients: [] },
        nonurgent: { count: 0, patients: [] }
      };
      
      // Rebuild summary
      updatedPatients.forEach(patient => {
        newSummary[patient.triageLevel].patients.push(patient);
        newSummary[patient.triageLevel].count++;
      });
      
      // Update localStorage
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      localStorage.setItem('patientSummary', JSON.stringify(newSummary));
      
      // Update state
      setPatients(updatedPatients);
      setPatientSummary(newSummary);
      setSelectedPatient(updatedPatient);
      
      // Show toast
      toast({
        title: "Patient updated",
        description: `Patient ${updatedPatient.id}'s information has been updated.`,
      });
      
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "Failed to update patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    selectedPatient,
    isModalOpen,
    patientSummary,
    handlePatientClick,
    handleModalClose,
    handleMarkDone,
    handleUpdatePatient
  };
};
