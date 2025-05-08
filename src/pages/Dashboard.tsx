
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PatientModal from '../components/PatientModal';
import { Patient } from '../utils/types';
import { usePatients } from '../hooks/usePatients';
import TriageSummary from '../components/dashboard/TriageSummary';
import TriageColumns from '../components/dashboard/TriageColumns';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import LoadingIndicator from '../components/dashboard/LoadingIndicator';

const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const { 
    patients, 
    patientSummary, 
    isLoading, 
    handlePatientDone 
  } = usePatients();

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader />
        
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <TriageSummary patientSummary={patientSummary} />
            
            <TriageColumns 
              patientSummary={patientSummary}
              onPatientClick={handlePatientClick}
              onPatientDone={handlePatientDone}
            />
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

export default Dashboard;
