
import React from 'react';
import { CreditCard } from 'lucide-react';

interface CardReaderProps {
  scanning: boolean;
}

const CardReader: React.FC<CardReaderProps> = ({ scanning }) => {
  return (
    <div className="relative">
      {/* Card reader base */}
      <div className="w-72 h-72 relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl overflow-hidden mx-auto">
        {/* Card reader display */}
        <div className="absolute inset-4 bg-gradient-to-tr from-blue-900/90 to-blue-700/60 rounded flex items-center justify-center overflow-hidden">
          {/* Card reader light effect */}
          <div className={`absolute inset-0 ${scanning ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-0 bg-blue-400/20"></div>
            {scanning && (
              <div className="absolute inset-x-0 h-1 bg-blue-400/40 animate-[scanline_2s_linear_infinite]"></div>
            )}
          </div>
          
          {/* Card icon */}
          <div className="relative z-10">
            <CreditCard 
              className={`w-32 h-32 ${scanning ? 'text-blue-300/80 animate-pulse' : 'text-blue-200/40'}`} 
              strokeWidth={1} 
            />
            
            {/* Card insertion slot */}
            <div className="mt-8 w-48 h-2 bg-black/70 rounded-full mx-auto relative overflow-hidden">
              {scanning && (
                <div className="absolute top-0 h-full bg-blue-400/40 w-16 animate-[card-swipe_3s_linear_infinite]"></div>
              )}
            </div>
          </div>
        </div>
        
        {/* Card reader details */}
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-tr from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`}></div>
        </div>
        
        {/* Keypad */}
        <div className="absolute bottom-4 left-4 grid grid-cols-3 gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
            <div 
              key={key} 
              className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-300 hover:bg-gray-600 cursor-pointer"
            >
              {key}
            </div>
          ))}
        </div>
      </div>
      
      {/* Card reader status */}
      <div className="text-center mt-6 text-gray-700">
        <p className="text-lg font-medium">
          {scanning ? 'Reading Shifaa card...' : 'Ready to scan'}
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

export default CardReader;
