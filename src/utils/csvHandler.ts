
import { Patient } from './types';
import { processNewPatient } from './triageModel';

// Function to parse CSV data into Patient objects
export const parseCSVData = (csvContent: string): Patient[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  console.log('CSV Headers:', headers);
  const patients: Patient[] = [];
  
  // Start from 1 to skip the header row
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length < 5) {
      console.warn(`Skipping invalid CSV row ${i}: insufficient columns`);
      continue; // Skip invalid rows
    }
    
    // Map CSV data to patient object - adjust field mapping based on your CSV structure
    try {
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
      patients.push(processedPatient);
    } catch (error) {
      console.error(`Error processing CSV row ${i}:`, error);
    }
  }
  
  console.log(`Successfully processed ${patients.length} patients from CSV`);
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
