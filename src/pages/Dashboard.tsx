
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PatientCard from '../components/PatientCard';
import PatientModal from '../components/PatientModal';
import { Patient } from '../utils/types';

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

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    // Load patients from localStorage
    const loadPatients = () => {
      const storedPatients = localStorage.getItem('patients');
      const storedSummary = localStorage.getItem('patientSummary');
      
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
      
      if (storedSummary) {
        setPatientSummary(JSON.parse(storedSummary));
      }
    };

    // Load initial data
    loadPatients();
    
    // Set up event listener for storage changes (for real-time updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'patients' || e.key === 'patientSummary') {
        loadPatients();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates every few seconds (as a fallback)
    const intervalId = setInterval(loadPatients, 3000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [navigate]);

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onClick={() => handlePatientClick(patient)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
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
