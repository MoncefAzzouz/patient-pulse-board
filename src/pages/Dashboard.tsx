
import React from 'react';
import Header from '../components/Header';
import PatientModal from '../components/PatientModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TriageSummary from '../components/dashboard/TriageSummary';
import TriageLayout from '../components/dashboard/TriageLayout';
import { useDashboardState } from '../hooks/useDashboardState';

const Dashboard = () => {
  const {
    selectedPatient,
    isModalOpen,
    patientSummary,
    handlePatientClick,
    handleModalClose,
    handleMarkDone,
    handleUpdatePatient
  } = useDashboardState();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader />
        <TriageSummary patientSummary={patientSummary} />
        <TriageLayout 
          patientSummary={patientSummary} 
          onPatientClick={handlePatientClick} 
          onMarkDone={handleMarkDone} 
        />
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
