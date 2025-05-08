
import { Patient } from './types';
import { processNewPatient, updatePatientSummary } from './triageModel';

// Function to parse CSV data into Patient objects
export const parseCSVData = (csvContent: string): Patient[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const patients: Patient[] = [];
  
  // Start from 1 to skip the header row
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length < 5) continue; // Skip invalid rows
    
    try {
      // Map CSV data to patient object - adjust field mapping based on your CSV structure
      const patientData = {
        age: parseInt(currentLine[headers.indexOf('age')] || '0', 10),
        gender: currentLine[headers.indexOf('gender')] || 'Male',
        chestPainType: parseInt(currentLine[headers.indexOf('chestPainType')] || '0', 10),
        cholesterol: parseInt(currentLine[headers.indexOf('cholesterol')] || '0', 10),
        exerciseAngina: parseInt(currentLine[headers.indexOf('exerciseAngina')] || '0', 10),
        plasmaGlucose: parseInt(currentLine[headers.indexOf('plasmaGlucose')] || '0', 10),
        skinThickness: parseInt(currentLine[headers.indexOf('skinThickness')] || '0', 10),
        bmi: parseFloat(currentLine[headers.indexOf('bmi')] || '0'),
        hypertension: parseInt(currentLine[headers.indexOf('hypertension')] || '0', 10),
        heartDisease: parseInt(currentLine[headers.indexOf('heartDisease')] || '0', 10),
        residenceType: currentLine[headers.indexOf('residenceType')] || 'Urban',
        smokingStatus: currentLine[headers.indexOf('smokingStatus')] || 'never smoked',
        symptom: currentLine[headers.indexOf('symptom')] || 'None',
        temperature: parseFloat(currentLine[headers.indexOf('temperature')] || '37'),
        heartRate: parseInt(currentLine[headers.indexOf('heartRate')] || '70', 10),
        respiratoryRate: parseInt(currentLine[headers.indexOf('respiratoryRate')] || '14', 10),
        bloodPressure: currentLine[headers.indexOf('bloodPressure')] || '120/80',
        spO2: parseInt(currentLine[headers.indexOf('spO2')] || '98', 10),
        glasgowScore: parseInt(currentLine[headers.indexOf('glasgowScore')] || '15', 10),
        consciousness: currentLine[headers.indexOf('consciousness')] || 'Awake',
        massiveBleeding: currentLine[headers.indexOf('massiveBleeding')] === 'true',
        respiratoryDistress: currentLine[headers.indexOf('respiratoryDistress')] === 'true',
        riskFactors: currentLine[headers.indexOf('riskFactors')] || '',
        triageLevel: 'standard', // Will be calculated by processNewPatient
        urgencyPercentage: 0 // Will be calculated by processNewPatient
      };
      
      // Process the patient through the ML model to get triage level
      const processedPatient = processNewPatient(patientData);
      
      console.log("Processed patient from CSV:", processedPatient);
      patients.push(processedPatient);
    } catch (error) {
      console.error("Error processing row:", error, "Row:", currentLine);
    }
  }
  
  return patients;
};

// Function to export patients to CSV
export const exportPatientsToCSV = (patients: Patient[]): string => {
  // Define CSV headers based on patient properties
  const headers = [
    'id', 'age', 'gender', 'chestPainType', 'cholesterol', 'exerciseAngina',
    'plasmaGlucose', 'skinThickness', 'bmi', 'hypertension', 'heartDisease',
    'residenceType', 'smokingStatus', 'symptom', 'temperature', 'heartRate',
    'respiratoryRate', 'bloodPressure', 'spO2', 'glasgowScore', 'consciousness',
    'massiveBleeding', 'respiratoryDistress', 'riskFactors', 'triageLevel', 'urgencyPercentage'
  ];
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  // Add patient data rows
  patients.forEach(patient => {
    const rowData = headers.map(header => {
      if (header === 'triageLevel' || header === 'gender' || header === 'residenceType' || 
          header === 'smokingStatus' || header === 'consciousness' || header === 'symptom' || 
          header === 'bloodPressure' || header === 'riskFactors') {
        return `"${patient[header as keyof Patient]}"`;
      } else {
        return patient[header as keyof Patient];
      }
    });
    csvContent += rowData.join(',') + '\n';
  });
  
  return csvContent;
};

// Function to append a new patient to the CSV file
export const appendPatientToCSV = (patient: Patient): string => {
  const headers = [
    'id', 'age', 'gender', 'chestPainType', 'cholesterol', 'exerciseAngina',
    'plasmaGlucose', 'skinThickness', 'bmi', 'hypertension', 'heartDisease',
    'residenceType', 'smokingStatus', 'symptom', 'temperature', 'heartRate',
    'respiratoryRate', 'bloodPressure', 'spO2', 'glasgowScore', 'consciousness',
    'massiveBleeding', 'respiratoryDistress', 'riskFactors', 'triageLevel', 'urgencyPercentage'
  ];
  
  const rowData = headers.map(header => {
    if (header === 'triageLevel' || header === 'gender' || header === 'residenceType' || 
        header === 'smokingStatus' || header === 'consciousness' || header === 'symptom' || 
        header === 'bloodPressure' || header === 'riskFactors') {
      return `"${patient[header as keyof Patient]}"`;
    } else {
      return patient[header as keyof Patient];
    }
  });
  
  return rowData.join(',') + '\n';
};

// New function to properly add patients to the dashboard
export const addPatientsToDatabase = (newPatients: Patient[]): void => {
  try {
    // Get existing patients from localStorage
    const storedPatients = localStorage.getItem('patients') || '[]';
    const existingPatients = JSON.parse(storedPatients);
    
    // Add new patients to existing ones
    const allPatients = [...existingPatients, ...newPatients];
    
    // Save all patients to localStorage
    localStorage.setItem('patients', JSON.stringify(allPatients));
    
    // Update patient summary for dashboard
    const summary = {
      critical: { count: 0, patients: [] as Patient[] },
      emergency: { count: 0, patients: [] as Patient[] },
      urgent: { count: 0, patients: [] as Patient[] },
      standard: { count: 0, patients: [] as Patient[] },
      nonurgent: { count: 0, patients: [] as Patient[] }
    };
    
    // Group all patients by triage level
    allPatients.forEach(patient => {
      const level = patient.triageLevel as keyof typeof summary;
      summary[level].count += 1;
      summary[level].patients.push(patient);
    });
    
    // Sort patients within each triage level by urgency percentage (descending)
    Object.keys(summary).forEach(level => {
      const triageLevel = level as keyof typeof summary;
      summary[triageLevel].patients.sort((a, b) => b.urgencyPercentage - a.urgencyPercentage);
    });
    
    // Save updated summary to localStorage
    localStorage.setItem('patientSummary', JSON.stringify(summary));
    
    // Trigger storage event for dashboard to detect the change
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('patientDataUpdated'));
    
    console.log(`Added ${newPatients.length} patients to database. Total: ${allPatients.length}`);
  } catch (error) {
    console.error("Error adding patients to database:", error);
  }
};
