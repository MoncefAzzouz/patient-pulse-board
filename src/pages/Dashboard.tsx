
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import PatientCard from '../components/PatientCard';
import PatientModal from '../components/PatientModal';
import { Patient } from '../utils/types';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { toast } from "sonner";
import { fetchPatientsFromSupabase, deletePatientFromSupabase } from '../utils/supabasePatients';

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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to organize patients by triage level
  const organizePatientsByTriage = (patientList: Patient[]) => {
    const summary = {
      critical: { count: 0, patients: [] as Patient[] },
      emergency: { count: 0, patients: [] as Patient[] },
      urgent: { count: 0, patients: [] as Patient[] },
      standard: { count: 0, patients: [] as Patient[] },
      nonurgent: { count: 0, patients: [] as Patient[] }
    };

    patientList.forEach(patient => {
      if (summary[patient.triageLevel]) {
        summary[patient.triageLevel].patients.push(patient);
        summary[patient.triageLevel].count++;
      }
    });

    // Sort patients in each category by urgency percentage (descending)
    Object.keys(summary).forEach(level => {
      if (summary[level].patients && Array.isArray(summary[level].patients)) {
        summary[level].patients.sort((a: Patient, b: Patient) => 
          b.urgencyPercentage - a.urgencyPercentage
        );
      }
    });

    return summary;
  };

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      // Fetch patients from Supabase
      const supabasePatients = await fetchPatientsFromSupabase();
      
      // Convert field names from lowercase (Supabase) to camelCase (Frontend)
      const formattedPatients = supabasePatients.map(patient => ({
        id: patient.id,
        age: patient.age,
        gender: patient.gender,
        chestPainType: patient.chestpaintype,
        cholesterol: patient.cholesterol,
        exerciseAngina: patient.exerciseangina,
        plasmaGlucose: patient.plasmaglucose,
        skinThickness: patient.skinthickness,
        bmi: patient.bmi,
        hypertension: patient.hypertension,
        heartDisease: patient.heartdisease,
        residenceType: patient.residencetype,
        smokingStatus: patient.smokingstatus,
        symptom: patient.symptom,
        temperature: patient.temperature,
        heartRate: patient.heartrate,
        respiratoryRate: patient.respiratoryrate,
        bloodPressure: patient.bloodpressure,
        spO2: patient.spo2,
        glasgowScore: patient.glasgowscore,
        consciousness: patient.consciousness,
        massiveBleeding: patient.massivebleeding,
        respiratoryDistress: patient.respiratorydistress,
        riskFactors: patient.riskfactors,
        triageLevel: patient.triagelevel,
        urgencyPercentage: patient.urgencypercentage
      }));

      console.log("Loaded patients from Supabase:", formattedPatients.length);
      
      // Set state with the fetched patients
      setPatients(formattedPatients);
      
      // Organize patients by triage level
      const summary = organizePatientsByTriage(formattedPatients);
      setPatientSummary(summary);
      
      // Also save to localStorage for offline backup
      localStorage.setItem('patients', JSON.stringify(formattedPatients));
      localStorage.setItem('patientSummary', JSON.stringify(summary));
    } catch (error) {
      console.error("Error loading patients from Supabase:", error);
      toast.error("Failed to load patients. Using local data if available.");
      
      // Fallback to localStorage if Supabase fails
      const storedPatients = localStorage.getItem('patients');
      const storedSummary = localStorage.getItem('patientSummary');
      
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
      
      if (storedSummary) {
        setPatientSummary(JSON.parse(storedSummary));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    // Load patients from Supabase
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

  const handlePatientDone = async (patient: Patient) => {
    try {
      // Remove patient from Supabase
      await deletePatientFromSupabase(patient.id);
      
      // Remove patient from the local patients array
      const updatedPatients = patients.filter(p => p.id !== patient.id);
      
      // Update patient summary
      const updatedSummary = {...patientSummary};
      updatedSummary[patient.triageLevel].patients = updatedSummary[patient.triageLevel].patients.filter(
        (p: Patient) => p.id !== patient.id
      );
      updatedSummary[patient.triageLevel].count--;
      
      // Save updated data to localStorage as backup
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      localStorage.setItem('patientSummary', JSON.stringify(updatedSummary));
      
      // Update state
      setPatients(updatedPatients);
      setPatientSummary(updatedSummary);
      
      // Show confirmation toast
      toast.success(`Patient ${patient.id} has been marked as done.`);
    } catch (error) {
      console.error("Error removing patient:", error);
      toast.error("Failed to remove patient. Please try again.");
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
            onDone={() => handlePatientDone(patient)}
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
              Shifa Card Reader
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading patients...</span>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      <PatientModal 
        patient={selectedPatient} 
        open={isModalOpen} 
        onClose={handleModalClose}
      />
    </div>
  );
};

// TriageSummary Component
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

// TriageSection Component
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
          onDone={() => handlePatientDone(patient)}
        />
      ))}
    </div>
  </div>
);

export default Dashboard;
