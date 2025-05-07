
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import PatientCard from '../components/PatientCard';
import PatientModal from '../components/PatientModal';
import { Patient } from '../utils/types';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientSummary, setPatientSummary] = useState<any>({
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

  const TriageSummary = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
      <div className="triage-card triage-card-critical">
        <div className="text-3xl font-bold">{patientSummary.critical.count}</div>
        <div className="text-sm">Critical</div>
      </div>
      <div className="triage-card triage-card-emergency">
        <div className="text-3xl font-bold">{patientSummary.emergency.count}</div>
        <div className="text-sm">Emergency</div>
      </div>
      <div className="triage-card triage-card-urgent">
        <div className="text-3xl font-bold">{patientSummary.urgent.count}</div>
        <div className="text-sm">Urgent</div>
      </div>
      <div className="triage-card triage-card-standard">
        <div className="text-3xl font-bold">{patientSummary.standard.count}</div>
        <div className="text-sm">Standard</div>
      </div>
      <div className="triage-card triage-card-nonurgent">
        <div className="text-3xl font-bold">{patientSummary.nonurgent.count}</div>
        <div className="text-sm">Non-urgent</div>
      </div>
    </div>
  );

  const TriageSection = ({ 
    title, 
    patients, 
    colorClass 
  }: { 
    title: string, 
    patients: Patient[], 
    colorClass: string 
  }) => (
    <div className="mb-6">
      <div className={`text-white font-bold px-4 py-2 mb-2 ${colorClass} rounded`}>
        {title}
      </div>
      <div className="px-1">
        {patients && patients.map((patient) => (
          <PatientCard
            key={`patient-${patient.id}`}
            patient={patient}
            onClick={() => handlePatientClick(patient)}
            onMarkDone={handleMarkDone}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Emergency Department Triage Dashboard</h1>
          <Link to="/fingerprint-scan">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <CreditCard className="h-4 w-4" />
              Shifaa Card Reader
            </Button>
          </Link>
        </div>
        
        <TriageSummary />
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="col-span-1">
            <TriageSection 
              title="Critical" 
              patients={patientSummary.critical.patients || []} 
              colorClass="bg-triage-critical"
            />
          </div>
          <div className="col-span-1">
            <TriageSection 
              title="Emergency" 
              patients={patientSummary.emergency.patients || []} 
              colorClass="bg-triage-emergency"
            />
          </div>
          <div className="col-span-1">
            <TriageSection 
              title="Urgent" 
              patients={patientSummary.urgent.patients || []} 
              colorClass="bg-triage-urgent"
            />
          </div>
          <div className="col-span-1">
            <TriageSection 
              title="Standard" 
              patients={patientSummary.standard.patients || []} 
              colorClass="bg-triage-standard"
            />
          </div>
          <div className="col-span-1">
            <TriageSection 
              title="Non-urgent" 
              patients={patientSummary.nonurgent.patients || []} 
              colorClass="bg-triage-nonurgent"
            />
          </div>
        </div>
      </div>

      <PatientModal 
        patient={selectedPatient} 
        open={isModalOpen} 
        onClose={handleModalClose}
        onUpdate={handleUpdatePatient}
      />
    </div>
  );
};

export default Dashboard;
