
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddPatient from "./pages/AddPatient";
import NotFound from "./pages/NotFound";
import FingerprintScan from "./pages/FingerprintScan";
import DatasetManagement from "./pages/DatasetManagement";
import Analytics from "./pages/Analytics";
import { useEffect } from "react";
import { patients, patientSummary } from "./data/patients"; 

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Initialize localStorage with sample data if empty
  useEffect(() => {
    if (!localStorage.getItem('patients')) {
      localStorage.setItem('patients', JSON.stringify(patients));
    }
    
    if (!localStorage.getItem('patientSummary')) {
      localStorage.setItem('patientSummary', JSON.stringify(patientSummary));
    }

    // Initialize empty CSV storage
    if (!localStorage.getItem('patientCSV')) {
      const headers = 'id,age,gender,chestPainType,cholesterol,exerciseAngina,' +
        'plasmaGlucose,skinThickness,bmi,hypertension,heartDisease,' +
        'residenceType,smokingStatus,symptom,temperature,heartRate,' +
        'respiratoryRate,bloodPressure,spO2,glasgowScore,consciousness,' +
        'massiveBleeding,respiratoryDistress,riskFactors,triageLevel,urgencyPercentage\n';
      localStorage.setItem('patientCSV', headers);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-patient" element={<AddPatient />} />
            <Route path="/fingerprint-scan" element={<FingerprintScan />} />
            <Route path="/dataset" element={<DatasetManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
