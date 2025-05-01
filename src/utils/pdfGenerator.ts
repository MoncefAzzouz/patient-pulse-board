
import { Patient } from './types';

export const generatePdf = (patient: Patient) => {
  // In a real-world scenario, we would use a library like jsPDF or pdfmake
  // For this prototype, we'll just create a simple data URL and open it in a new tab
  
  const formatBloodPressure = (bp: string) => {
    const [systolic, diastolic] = bp.split('/');
    return `${systolic}/${diastolic} mmHg`;
  };

  const getChestPainType = (code: number) => {
    return code === 0 ? 'Asymptomatic' :
      code === 1 ? 'Atypical Angina' :
      code === 2 ? 'Non-anginal Pain' :
      'Typical Angina';
  };

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'emergency': return '#ea580c';
      case 'urgent': return '#ca8a04';
      case 'standard': return '#16a34a';
      case 'nonurgent': return '#2563eb';
      default: return '#000000';
    }
  };

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Medical Report - Patient ${patient.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .subtitle {
          font-size: 16px;
          color: #666;
        }
        .triage-label {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          color: white;
          font-weight: bold;
          text-transform: capitalize;
          background-color: ${getTriageColor(patient.triageLevel)};
        }
        .section {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .item {
          margin-bottom: 10px;
        }
        .label {
          font-weight: bold;
          display: block;
          font-size: 14px;
          color: #555;
        }
        .value {
          font-size: 15px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Medical Report</div>
        <div class="subtitle">Patient ID: ${patient.id}</div>
        <div class="subtitle">Generated on: ${currentDate} at ${currentTime}</div>
        <div style="margin-top: 10px;">
          <span class="triage-label">${patient.triageLevel} - ${patient.urgencyPercentage}%</span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Basic Information</div>
        <div class="grid">
          <div class="item">
            <span class="label">Age:</span>
            <span class="value">${patient.age} years</span>
          </div>
          <div class="item">
            <span class="label">Gender:</span>
            <span class="value">${patient.gender}</span>
          </div>
          <div class="item">
            <span class="label">Residence:</span>
            <span class="value">${patient.residenceType}</span>
          </div>
          <div class="item">
            <span class="label">Smoking Status:</span>
            <span class="value">${patient.smokingStatus}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Vital Signs</div>
        <div class="grid">
          <div class="item">
            <span class="label">Temperature:</span>
            <span class="value">${patient.temperature}°C</span>
          </div>
          <div class="item">
            <span class="label">Heart Rate:</span>
            <span class="value">${patient.heartRate} bpm</span>
          </div>
          <div class="item">
            <span class="label">Blood Pressure:</span>
            <span class="value">${formatBloodPressure(patient.bloodPressure)}</span>
          </div>
          <div class="item">
            <span class="label">SpO2:</span>
            <span class="value">${patient.spO2}%</span>
          </div>
          <div class="item">
            <span class="label">Respiratory Rate:</span>
            <span class="value">${patient.respiratoryRate} breaths/min</span>
          </div>
          <div class="item">
            <span class="label">Hypertension:</span>
            <span class="value">${patient.hypertension ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Cardiac Status</div>
        <div class="grid">
          <div class="item">
            <span class="label">Chest Pain Type:</span>
            <span class="value">${getChestPainType(patient.chestPainType)}</span>
          </div>
          <div class="item">
            <span class="label">Cholesterol:</span>
            <span class="value">${patient.cholesterol} mg/dL</span>
          </div>
          <div class="item">
            <span class="label">Exercise Angina:</span>
            <span class="value">${patient.exerciseAngina ? 'Yes' : 'No'}</span>
          </div>
          <div class="item">
            <span class="label">Heart Disease:</span>
            <span class="value">${patient.heartDisease ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Clinical Assessment</div>
        <div class="grid">
          <div class="item">
            <span class="label">Glasgow Score:</span>
            <span class="value">${patient.glasgowScore}</span>
          </div>
          <div class="item">
            <span class="label">Consciousness:</span>
            <span class="value">${patient.consciousness}</span>
          </div>
          <div class="item">
            <span class="label">Respiratory Distress:</span>
            <span class="value">${patient.respiratoryDistress ? 'Yes' : 'No'}</span>
          </div>
          <div class="item">
            <span class="label">Massive Bleeding:</span>
            <span class="value">${patient.massiveBleeding ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Additional Information</div>
        <div class="grid">
          <div class="item">
            <span class="label">BMI:</span>
            <span class="value">${patient.bmi}</span>
          </div>
          <div class="item">
            <span class="label">Plasma Glucose:</span>
            <span class="value">${patient.plasmaGlucose} mg/dL</span>
          </div>
          <div class="item">
            <span class="label">Symptoms:</span>
            <span class="value">${patient.symptom}</span>
          </div>
          <div class="item">
            <span class="label">Risk Factors:</span>
            <span class="value">${patient.riskFactors || 'None'}</span>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>This is a confidential medical document.</p>
        <p>Emergency Department Triage System</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const newWindow = window.open(url, '_blank');
  if (newWindow) {
    newWindow.document.title = `Medical Report - Patient ${patient.id}`;
    
    // Add print functionality
    setTimeout(() => {
      newWindow.print();
    }, 1000);
  }
};
