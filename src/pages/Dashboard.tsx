import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import PatientCard from '../components/PatientCard';
import PatientModal from '../components/PatientModal';
import { Patient } from '../utils/types';
import { Button } from '@/components/ui/button';
import { Fingerprint } from 'lucide-react';
import { skipPatientInSupabase } from '../utils/supabaseClient';

const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [skippedPatients, setSkippedPatients] = useState<string[]>([]);
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

    // Load skipped patients from localStorage
    const loadSkippedPatients = () => {
      const storedSkipped = localStorage.getItem('skippedPatients');
      if (storedSkipped) {
        setSkippedPatients(JSON.parse(storedSkipped));
      }
    };

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
    loadSkippedPatients();
    
    // Set up event listener for storage changes (for real-time updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'patients' || e.key === 'patientSummary') {
        console.log("Storage changed, reloading patients");
        loadPatients();
      }
      if (e.key === 'skippedPatients') {
        loadSkippedPatients();
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

  const handleSkipPatient = async (patientId: string) => {
    // Add patient to skipped list locally
    const updatedSkipped = [...skippedPatients, patientId];
    setSkippedPatients(updatedSkipped);
    
    // Save to localStorage
    localStorage.setItem('skippedPatients', JSON.stringify(updatedSkipped));
    
    // Also remove from Supabase if connected
    try {
      await skipPatientInSupabase(patientId);
      console.log(`Patient ${patientId} removed from Supabase`);
    } catch (error) {
      console.error("Error removing patient from Supabase:", error);
    }
    
    // Show toast notification
    toast({
      title: "Patient skipped",
      description: `Patient ${patientId} has been removed from the queue and Supabase database.`,
      variant: "default",
    });

    // Trigger a storage event to update other tabs
    window.dispatchEvent(new StorageEvent('storage', { key: 'skippedPatients' }));
    window.dispatchEvent(new Event('patientDataUpdated'));
  };

  // Filter out skipped patients from each section
  const getFilteredPatients = (patients: Patient[]) => {
    return patients.filter(patient => !skippedPatients.includes(patient.id.toString()));
  };

  const TriageSummary = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
      <div className="triage-card triage-card-critical">
        <div className="text-3xl font-bold">{patientSummary.critical.count - getFilteredPatients(patientSummary.critical.patients).length + getFilteredPatients(patientSummary.critical.patients).length}</div>
        <div className="text-sm">Critical</div>
      </div>
      <div className="triage-card triage-card-emergency">
        <div className="text-3xl font-bold">{patientSummary.emergency.count - getFilteredPatients(patientSummary.emergency.patients).length + getFilteredPatients(patientSummary.emergency.patients).length}</div>
        <div className="text-sm">Emergency</div>
      </div>
      <div className="triage-card triage-card-urgent">
        <div className="text-3xl font-bold">{patientSummary.urgent.count - getFilteredPatients(patientSummary.urgent.patients).length + getFilteredPatients(patientSummary.urgent.patients).length}</div>
        <div className="text-sm">Urgent</div>
      </div>
      <div className="triage-card triage-card-standard">
        <div className="text-3xl font-bold">{patientSummary.standard.count - getFilteredPatients(patientSummary.standard.patients).length + getFilteredPatients(patientSummary.standard.patients).length}</div>
        <div className="text-sm">Standard</div>
      </div>
      <div className="triage-card triage-card-nonurgent">
        <div className="text-3xl font-bold">{patientSummary.nonurgent.count - getFilteredPatients(patientSummary.nonurgent.patients).length + getFilteredPatients(patientSummary.nonurgent.patients).length}</div>
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
  }) => {
    // Filter out skipped patients
    const filteredPatients = getFilteredPatients(patients);
    
    return (
      <div className="mb-6">
        <div className={`text-white font-bold px-4 py-2 mb-2 ${colorClass} rounded`}>
          {title}
        </div>
        <div className="px-1">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={() => handlePatientClick(patient)}
              onSkip={handleSkipPatient}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Emergency Department Triage Dashboard</h1>
          <Link to="/fingerprint-scan">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Fingerprint className="h-4 w-4" />
              Fingerprint Scan
            </Button>
          </Link>
        </div>
        
        <TriageSummary />
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="col-span-1">
            <TriageSection 
              title="Critical" 
              patients={patientSummary.critical.patients} 
              colorClass="bg-triage-critical"
            />
          </div>
          <div className="col-span-1">
            <TriageSection 
              title="Emergency" 
              patients={patientSummary.emergency.patients} 
              colorClass="bg-triage-emergency"
            />
          </div>
          <div className="col-span-1">
            <TriageSection 
              title="Urgent" 
              patients={patientSummary.urgent.patients} 
              colorClass="bg-triage-urgent"
            />
          </div>
          <div className="col-span-1">
            <TriageSection 
              title="Standard" 
              patients={patientSummary.standard.patients} 
              colorClass="bg-triage-standard"
            />
          </div>
          <div className="col-span-1">
            <TriageSection 
              title="Non-urgent" 
              patients={patientSummary.nonurgent.patients} 
              colorClass="bg-triage-nonurgent"
            />
          </div>
        </div>
      </div>

      <PatientModal 
        patient={selectedPatient} 
        open={isModalOpen} 
        onClose={handleModalClose}
      />
    </div>
  );
};

export default Dashboard;
