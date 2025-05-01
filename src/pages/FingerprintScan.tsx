
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FingerprintScanner from '../components/FingerprintScanner';
import { Patient } from '../utils/types';
import { generatePdf } from '../utils/pdfGenerator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fingerprint, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FingerprintScan = () => {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const handleScan = () => {
    setScanning(true);
    setError(null);
    
    // Simulate scanning process with timeout
    setTimeout(() => {
      // Get patients from localStorage
      const storedPatients = localStorage.getItem('patients');
      if (storedPatients) {
        const patients = JSON.parse(storedPatients) as Patient[];
        
        // For demo, just pick a random patient
        if (patients.length > 0) {
          const randomIndex = Math.floor(Math.random() * patients.length);
          setPatient(patients[randomIndex]);
          setScanned(true);
          setScanning(false);
          
          toast({
            title: "Patient identified",
            description: `Patient ID: ${patients[randomIndex].id} has been found in the system.`,
            variant: "success",
          });
        } else {
          setScanning(false);
          setError("No patients found in the system.");
          
          toast({
            title: "Scan failed",
            description: "No patients found in the system.",
            variant: "destructive",
          });
        }
      } else {
        setScanning(false);
        setError("Patient database not available.");
        
        toast({
          title: "Scan failed",
          description: "Patient database not available.",
          variant: "destructive",
        });
      }
    }, 3000);
  };

  const handleReset = () => {
    setScanned(false);
    setPatient(null);
    setError(null);
  };

  const handleDownload = () => {
    if (patient) {
      generatePdf(patient);
      
      toast({
        title: "Download started",
        description: "Patient medical report is being downloaded.",
        variant: "success",
      });
    }
  };

  const formatBloodPressure = (bp: string) => {
    const [systolic, diastolic] = bp.split('/');
    return `${systolic}/${diastolic} mmHg`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <Fingerprint className="h-8 w-8 text-blue-500" />
                Fingerprint Patient Identification
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Scan patient fingerprint to retrieve their medical documents
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!scanned && !error && (
                <div className="flex flex-col items-center justify-center py-6">
                  <FingerprintScanner scanning={scanning} />
                  
                  {!scanning && (
                    <div className="mt-8 text-center">
                      <Button 
                        onClick={handleScan} 
                        className="py-6 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                      >
                        <Fingerprint className="mr-2 h-6 w-6" />
                        Start Fingerprint Scan
                      </Button>
                      <p className="mt-4 text-gray-600">
                        Place the patient's finger on the scanner and press the button
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {error && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-700 mb-2">Scan Failed</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="bg-white hover:bg-gray-100"
                  >
                    Try Again
                  </Button>
                </div>
              )}
              
              {scanned && patient && (
                <div className="py-4">
                  <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Patient Medical Report
                  </h3>
                  
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
                          <p className="text-sm text-gray-500">Patient ID:</p>
                          <p className="font-medium">{patient.id}</p>
                        </div>
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
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4">
              {scanned && patient ? (
                <>
                  <Button variant="outline" onClick={handleReset}>
                    Scan Another Patient
                  </Button>
                  <Button onClick={handleDownload} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4" />
                    Download Medical Report
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="mx-auto"
                >
                  Return to Dashboard
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FingerprintScan;
