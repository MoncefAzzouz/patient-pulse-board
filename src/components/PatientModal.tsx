
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Patient } from '../utils/types';
import { generatePdf } from '../utils/pdfGenerator';
import { Download, Edit } from 'lucide-react';
import PatientEditForm from './PatientEditForm';

interface PatientModalProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedPatient: Patient) => void;
}

const PatientModal: React.FC<PatientModalProps> = ({ patient, open, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!patient) return null;

  const handleDownloadPdf = () => {
    if (patient) {
      generatePdf(patient);
    }
  };

  const formatBloodPressure = (bp: string) => {
    const [systolic, diastolic] = bp.split('/');
    return `${systolic}/${diastolic} mmHg`;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (updatedPatient: Patient) => {
    onUpdate(updatedPatient);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient {patient.id}'s Information</DialogTitle>
          </DialogHeader>
          <PatientEditForm 
            patient={patient} 
            onCancel={handleCancelEdit} 
            onSave={handleSaveEdit}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Patient {patient.id}'s Medical Details</DialogTitle>
          <DialogDescription>
            Complete medical information and vital signs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Age:</p>
                <p className="font-medium">{patient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender:</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Residence:</p>
                <p className="font-medium">{patient.residenceType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Smoking Status:</p>
                <p className="font-medium">{patient.smokingStatus}</p>
              </div>
            </div>

            {/* Cardiac Status */}
            <h3 className="text-lg font-semibold flex items-center gap-2 text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Cardiac Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Chest Pain Type:</p>
                <p className="font-medium">
                  {patient.chestPainType === 0 ? 'Asymptomatic' :
                    patient.chestPainType === 1 ? 'Atypical Angina' :
                    patient.chestPainType === 2 ? 'Non-anginal Pain' :
                    'Typical Angina'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cholesterol:</p>
                <p className="font-medium">{patient.cholesterol} mg/dL</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Exercise Angina:</p>
                <p className="font-medium">{patient.exerciseAngina ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Heart Disease:</p>
                <p className="font-medium">{patient.heartDisease ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            {/* Additional Information */}
            <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Additional Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">BMI:</p>
                <p className="font-medium">{patient.bmi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Plasma Glucose:</p>
                <p className="font-medium">{patient.plasmaGlucose} mg/dL</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Symptoms:</p>
                <p className="font-medium">{patient.symptom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Risk Factors:</p>
                <p className="font-medium">{patient.riskFactors || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Vital Signs
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Temperature:</p>
                <p className="font-medium">{patient.temperature}°C</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Heart Rate:</p>
                <p className="font-medium">{patient.heartRate} bpm</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Pressure:</p>
                <p className="font-medium">{formatBloodPressure(patient.bloodPressure)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">SpO2:</p>
                <p className="font-medium">{patient.spO2}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Respiratory Rate:</p>
                <p className="font-medium">{patient.respiratoryRate} breaths/min</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hypertension:</p>
                <p className="font-medium">{patient.hypertension ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Clinical Assessment */}
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Clinical Assessment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Glasgow Score:</p>
                <p className="font-medium">{patient.glasgowScore}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consciousness:</p>
                <p className="font-medium">{patient.consciousness}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Respiratory Distress:</p>
                <p className="font-medium">{patient.respiratoryDistress ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Massive Bleeding:</p>
                <p className="font-medium">{patient.massiveBleeding ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Triage Information */}
            <h3 className="text-lg font-semibold flex items-center gap-2 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Triage Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Triage Level:</p>
                <p className={`font-medium capitalize text-triage-${patient.triageLevel}`}>
                  {patient.triageLevel}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Urgency:</p>
                <p className={`font-medium text-triage-${patient.triageLevel}`}>
                  {patient.urgencyPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleEditClick} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Patient
          </Button>
          <Button onClick={handleDownloadPdf} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Medical Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientModal;
