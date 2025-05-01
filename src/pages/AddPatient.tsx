
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import { Patient, TriageLevel, PatientFormData } from '../utils/types';
import { processNewPatient, getPatientWarnings } from '../utils/triageModel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AddPatient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Basic form state
  const [formData, setFormData] = useState<PatientFormData>({
    age: '',
    gender: '',
    chestPainType: '',
    cholesterol: '',
    exerciseAngina: false,
    plasmaGlucose: '',
    skinThickness: '',
    bmi: '',
    hypertension: false,
    heartDisease: false,
    residenceType: '',
    smokingStatus: '',
    symptom: '',
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    spO2: '',
    glasgowScore: '',
    consciousness: '',
    massiveBleeding: false,
    respiratoryDistress: false,
    riskFactors: ''
  });

  const [calculatedTriage, setCalculatedTriage] = useState<TriageLevel>('standard');
  const [urgencyPercentage, setUrgencyPercentage] = useState<number>(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  
  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Calculate triage level using ML model
  useEffect(() => {
    try {
      // Only calculate if enough critical data is present
      if (
        formData.age && 
        formData.temperature && 
        formData.heartRate && 
        formData.respiratoryRate && 
        formData.spO2 && 
        formData.glasgowScore
      ) {
        // Prepare patient data object for prediction
        const patientData = {
          age: parseInt(formData.age, 10),
          gender: formData.gender,
          chestPainType: parseInt(formData.chestPainType || '0', 10),
          cholesterol: parseInt(formData.cholesterol || '0', 10),
          exerciseAngina: formData.exerciseAngina ? 1 : 0,
          plasmaGlucose: parseInt(formData.plasmaGlucose || '0', 10),
          skinThickness: parseInt(formData.skinThickness || '0', 10),
          bmi: parseFloat(formData.bmi || '0'),
          hypertension: formData.hypertension ? 1 : 0,
          heartDisease: formData.heartDisease ? 1 : 0,
          residenceType: formData.residenceType,
          smokingStatus: formData.smokingStatus,
          symptom: formData.symptom,
          temperature: parseFloat(formData.temperature),
          heartRate: parseInt(formData.heartRate, 10),
          respiratoryRate: parseInt(formData.respiratoryRate, 10),
          bloodPressure: `${formData.bloodPressureSys || '0'}/${formData.bloodPressureDia || '0'}`,
          spO2: parseInt(formData.spO2, 10),
          glasgowScore: parseInt(formData.glasgowScore, 10),
          consciousness: formData.consciousness,
          massiveBleeding: formData.massiveBleeding,
          respiratoryDistress: formData.respiratoryDistress,
          riskFactors: formData.riskFactors,
        };
        
        // Process through our triage model
        const processedPatient = processNewPatient(patientData);
        
        // Update state with predictions
        setCalculatedTriage(processedPatient.triageLevel);
        setUrgencyPercentage(processedPatient.urgencyPercentage);
        
        // Get warnings from patient data
        setWarnings(getPatientWarnings(processedPatient));
      }
    } catch (error) {
      console.error("Error calculating triage level:", error);
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format data for API
      const patientData = {
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        chestPainType: parseInt(formData.chestPainType || '0', 10),
        cholesterol: parseInt(formData.cholesterol || '0', 10),
        exerciseAngina: formData.exerciseAngina ? 1 : 0,
        plasmaGlucose: parseInt(formData.plasmaGlucose || '0', 10),
        skinThickness: parseInt(formData.skinThickness || '0', 10),
        bmi: parseFloat(formData.bmi || '0'),
        hypertension: formData.hypertension ? 1 : 0,
        heartDisease: formData.heartDisease ? 1 : 0,
        residenceType: formData.residenceType,
        smokingStatus: formData.smokingStatus,
        symptom: formData.symptom,
        temperature: parseFloat(formData.temperature),
        heartRate: parseInt(formData.heartRate, 10),
        respiratoryRate: parseInt(formData.respiratoryRate, 10),
        bloodPressure: `${formData.bloodPressureSys || '0'}/${formData.bloodPressureDia || '0'}`,
        spO2: parseInt(formData.spO2, 10),
        glasgowScore: parseInt(formData.glasgowScore, 10),
        consciousness: formData.consciousness,
        massiveBleeding: formData.massiveBleeding,
        respiratoryDistress: formData.respiratoryDistress,
        riskFactors: formData.riskFactors,
      };
      
      // Process through our ML model
      const patient = processNewPatient(patientData);
      
      // In a real app, we would send this to a backend API
      console.log("ML model produced patient data:", patient);
      
      toast({
        title: "Patient added successfully",
        description: `Patient has been added with ${patient.triageLevel} priority (${patient.urgencyPercentage}%).`,
      });
      
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error("Error processing patient data:", error);
      toast({
        title: "Error adding patient",
        description: "There was a problem processing the patient data.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getTriageColor = () => {
    switch (calculatedTriage) {
      case 'critical': return 'text-triage-critical';
      case 'emergency': return 'text-triage-emergency';
      case 'urgent': return 'text-triage-urgent';
      case 'standard': return 'text-triage-standard';
      case 'nonurgent': return 'text-triage-nonurgent';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Add New Patient" />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>New Patient Registration</span>
              <div className="flex items-center gap-4">
                <span className="text-base">
                  Urgency: 
                  <span className={`ml-2 font-bold ${getTriageColor()}`}>
                    {urgencyPercentage}%
                  </span>
                </span>
                <span className="text-base">
                  Predicted Triage: 
                  <span className={`ml-2 font-bold capitalize ${getTriageColor()}`}>
                    {calculatedTriage}
                  </span>
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {warnings.length > 0 && (
              <div className="mb-6">
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTitle className="text-amber-700">Patient Risk Factors Detected</AlertTitle>
                  <AlertDescription className="text-amber-600">
                    <ul className="list-disc pl-5 mt-2">
                      {warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="section-header">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      name="age"
                      type="number" 
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="residenceType">Residence Type</Label>
                    <Select onValueChange={(value) => handleSelectChange('residenceType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select residence type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Urban">Urban</SelectItem>
                          <SelectItem value="Rural">Rural</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smokingStatus">Smoking Status</Label>
                    <Select onValueChange={(value) => handleSelectChange('smokingStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="never smoked">Never Smoked</SelectItem>
                          <SelectItem value="former smoker">Former Smoker</SelectItem>
                          <SelectItem value="current smoker">Current Smoker</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="symptom">Symptoms</Label>
                    <Textarea 
                      id="symptom" 
                      name="symptom"
                      placeholder="Enter patient's symptoms"
                      value={formData.symptom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div>
                <h3 className="section-header">Vital Signs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input 
                      id="temperature" 
                      name="temperature"
                      type="number" 
                      step="0.1"
                      placeholder="Enter temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Input 
                      id="heartRate" 
                      name="heartRate"
                      type="number" 
                      placeholder="Enter heart rate"
                      value={formData.heartRate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                    <Input 
                      id="respiratoryRate" 
                      name="respiratoryRate"
                      type="number" 
                      placeholder="Enter respiratory rate"
                      value={formData.respiratoryRate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Pressure (mmHg)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="bloodPressureSys" 
                        name="bloodPressureSys"
                        type="number" 
                        placeholder="Systolic"
                        value={formData.bloodPressureSys}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="flex items-center">/</span>
                      <Input 
                        id="bloodPressureDia" 
                        name="bloodPressureDia"
                        type="number" 
                        placeholder="Diastolic"
                        value={formData.bloodPressureDia}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spO2">SpO2 (%)</Label>
                    <Input 
                      id="spO2" 
                      name="spO2"
                      type="number" 
                      min="0"
                      max="100"
                      placeholder="Enter SpO2"
                      value={formData.spO2}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Cardiac Status */}
              <div>
                <h3 className="section-header">Cardiac Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chestPainType">Chest Pain Type</Label>
                    <Select onValueChange={(value) => handleSelectChange('chestPainType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pain type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0">Asymptomatic</SelectItem>
                          <SelectItem value="1">Atypical Angina</SelectItem>
                          <SelectItem value="2">Non-anginal Pain</SelectItem>
                          <SelectItem value="3">Typical Angina</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cholesterol">Cholesterol (mg/dL)</Label>
                    <Input 
                      id="cholesterol" 
                      name="cholesterol"
                      type="number" 
                      placeholder="Enter cholesterol"
                      value={formData.cholesterol}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="exerciseAngina" className="mb-2">Exercise Angina</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="exerciseAngina" 
                        checked={formData.exerciseAngina}
                        onCheckedChange={(checked) => handleSwitchChange('exerciseAngina', checked)}
                      />
                      <Label htmlFor="exerciseAngina">
                        {formData.exerciseAngina ? 'Yes' : 'No'}
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="heartDisease" className="mb-2">Heart Disease</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="heartDisease" 
                        checked={formData.heartDisease}
                        onCheckedChange={(checked) => handleSwitchChange('heartDisease', checked)}
                      />
                      <Label htmlFor="heartDisease">
                        {formData.heartDisease ? 'Yes' : 'No'}
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="hypertension" className="mb-2">Hypertension</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="hypertension" 
                        checked={formData.hypertension}
                        onCheckedChange={(checked) => handleSwitchChange('hypertension', checked)}
                      />
                      <Label htmlFor="hypertension">
                        {formData.hypertension ? 'Yes' : 'No'}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Assessment */}
              <div>
                <h3 className="section-header">Clinical Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="glasgowScore">Glasgow Score</Label>
                    <Select onValueChange={(value) => handleSelectChange('glasgowScore', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Glasgow Coma Scale</SelectLabel>
                          {[3,4,5,6,7,8,9,10,11,12,13,14,15].map(score => (
                            <SelectItem key={score} value={String(score)}>
                              {score}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consciousness">Consciousness</Label>
                    <Select onValueChange={(value) => handleSelectChange('consciousness', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Awake">Awake</SelectItem>
                          <SelectItem value="Verbal response">Responds to verbal</SelectItem>
                          <SelectItem value="Responsive to pain">Responsive to pain</SelectItem>
                          <SelectItem value="Unresponsive">Unresponsive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="respiratoryDistress" className="mb-2">Respiratory Distress</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="respiratoryDistress" 
                        checked={formData.respiratoryDistress}
                        onCheckedChange={(checked) => handleSwitchChange('respiratoryDistress', checked)}
                      />
                      <Label htmlFor="respiratoryDistress">
                        {formData.respiratoryDistress ? 'Yes' : 'No'}
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="massiveBleeding" className="mb-2">Massive Bleeding</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="massiveBleeding" 
                        checked={formData.massiveBleeding}
                        onCheckedChange={(checked) => handleSwitchChange('massiveBleeding', checked)}
                      />
                      <Label htmlFor="massiveBleeding">
                        {formData.massiveBleeding ? 'Yes' : 'No'}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="section-header">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bmi">BMI</Label>
                    <Input 
                      id="bmi" 
                      name="bmi"
                      type="number" 
                      step="0.1"
                      placeholder="Enter BMI"
                      value={formData.bmi}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plasmaGlucose">Plasma Glucose (mg/dL)</Label>
                    <Input 
                      id="plasmaGlucose" 
                      name="plasmaGlucose"
                      type="number" 
                      placeholder="Enter plasma glucose"
                      value={formData.plasmaGlucose}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skinThickness">Skin Thickness (mm)</Label>
                    <Input 
                      id="skinThickness" 
                      name="skinThickness"
                      type="number" 
                      placeholder="Enter skin thickness"
                      value={formData.skinThickness}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="riskFactors">Risk Factors</Label>
                    <Textarea 
                      id="riskFactors" 
                      name="riskFactors"
                      placeholder="Enter patient's risk factors"
                      value={formData.riskFactors}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Patient"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddPatient;
