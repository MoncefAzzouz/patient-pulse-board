
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Patient } from '../utils/types';
import ImportDataset from '../components/dataset/ImportDataset';
import ExportDataset from '../components/dataset/ExportDataset';
import DatasetStatistics from '../components/dataset/DatasetStatistics';

const DatasetManagement = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    // Load patients from localStorage
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  }, [navigate]);

  const handleImport = (newPatients: Patient[]) => {
    setPatients(prev => [...prev, ...newPatients]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dataset Management" />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          <ImportDataset onImport={handleImport} />
          <ExportDataset patients={patients} />
          <DatasetStatistics patients={patients} />
        </div>
      </div>
    </div>
  );
};

export default DatasetManagement;
