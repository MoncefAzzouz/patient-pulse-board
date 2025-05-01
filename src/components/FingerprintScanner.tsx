
import React from 'react';
import { Fingerprint } from 'lucide-react';

interface FingerprintScannerProps {
  scanning: boolean;
}

const FingerprintScanner: React.FC<FingerprintScannerProps> = ({ scanning }) => {
  return (
    <div className="relative">
      {/* Scanner base */}
      <div className="w-72 h-72 relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl overflow-hidden mx-auto">
        {/* Scanner glass */}
        <div className="absolute inset-4 bg-gradient-to-tr from-blue-900/90 to-blue-700/60 rounded flex items-center justify-center overflow-hidden">
          {/* Scanner light effect */}
          <div className={`absolute inset-0 ${scanning ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-0 bg-blue-400/20"></div>
            {scanning && (
              <div className="absolute inset-x-0 h-1 bg-blue-400/40 animate-[scanline_2s_linear_infinite]"></div>
            )}
          </div>
          
          {/* Fingerprint icon */}
          <Fingerprint 
            className={`w-32 h-32 ${scanning ? 'text-blue-300/80 animate-pulse' : 'text-blue-200/40'}`} 
            strokeWidth={1} 
          />
        </div>
        
        {/* Scanner details */}
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-tr from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`}></div>
        </div>
      </div>
      
      {/* Scanner status */}
      <div className="text-center mt-6 text-gray-700">
        <p className="text-lg font-medium">
          {scanning ? 'Scanning fingerprint...' : 'Ready to scan'}
        </p>
        {scanning && (
          <div className="flex items-center justify-center mt-2 space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-[pulse_0.8s_ease-in-out_infinite]"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-[pulse_0.8s_ease-in-out_0.2s_infinite]"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-[pulse_0.8s_ease-in-out_0.4s_infinite]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FingerprintScanner;
