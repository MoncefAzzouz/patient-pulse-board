
import React from 'react';
import { CreditCard, NFC } from 'lucide-react';

interface ShifaCardReaderProps {
  scanning: boolean;
}

const ShifaCardReader: React.FC<ShifaCardReaderProps> = ({ scanning }) => {
  return (
    <div className="relative">
      {/* Card Reader base */}
      <div className="w-72 h-72 relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl overflow-hidden mx-auto">
        {/* Card Reader glass */}
        <div className="absolute inset-4 bg-gradient-to-tr from-blue-900/90 to-blue-700/60 rounded flex items-center justify-center overflow-hidden">
          {/* Card Reader light effect */}
          <div className={`absolute inset-0 ${scanning ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-0 bg-blue-400/20"></div>
            {scanning && (
              <div className="absolute inset-x-0 h-2 bg-blue-400/60 animate-[scanline_2s_linear_infinite]"></div>
            )}
          </div>
          
          {/* Card icon */}
          <div className="relative">
            <CreditCard 
              className={`w-32 h-32 ${scanning ? 'text-blue-300/80 animate-pulse' : 'text-blue-200/40'}`} 
              strokeWidth={1} 
            />
            {scanning && (
              <NFC 
                className="w-8 h-8 text-blue-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" 
                strokeWidth={1} 
              />
            )}
          </div>
        </div>
        
        {/* Reader details */}
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-tr from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`}></div>
        </div>
      </div>
      
      {/* Reader status */}
      <div className="text-center mt-6 text-gray-700">
        <p className="text-lg font-medium">
          {scanning ? 'Scanning Shifa card...' : 'Ready to scan card'}
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

export default ShifaCardReader;
