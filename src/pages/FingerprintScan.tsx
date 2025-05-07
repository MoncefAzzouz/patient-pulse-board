
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CardReader from '../components/CardReader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const FingerprintScan = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    
    // Show toast at start of scan
    toast({
      title: "Scan initiated",
      description: "Please insert or tap Shifaa card",
    });

    // Simulate scanning with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        
        // When scan is complete, clear interval, show toast, and navigate
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanning(false);
            toast({
              title: "Card read successfully",
              description: "Patient information retrieved successfully",
            });
            navigate('/add-patient');
          }, 1000);
        }
        
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-8">Shifaa Card Reader</h1>
            
            <div className="mb-8">
              <CardReader scanning={scanning} />
            </div>
            
            {scanning ? (
              <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  Reading card... {progress}%
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button 
                  onClick={startScan} 
                  className="bg-blue-600 hover:bg-blue-700 px-10"
                >
                  Scan Card
                </Button>
              </div>
            )}
            
            <div className="mt-8 text-center text-gray-600">
              <p>Tap or insert patient's Shifaa card to retrieve their information</p>
              <p className="mt-2 text-sm">Using Shifaa Card Reader v2.0</p>
            </div>
            
            {scanning && (
              <div className="mt-6 text-sm text-center text-blue-600 animate-pulse">
                Please do not remove card until scan is complete
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerprintScan;
