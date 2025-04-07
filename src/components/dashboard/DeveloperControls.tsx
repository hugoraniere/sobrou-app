
import React from 'react';

interface DeveloperControlsProps {
  whatsAppConnected: boolean;
  toggleWhatsApp: () => void;
}

const DeveloperControls: React.FC<DeveloperControlsProps> = ({ 
  whatsAppConnected, 
  toggleWhatsApp 
}) => {
  return (
    <div className="bg-gray-100 p-2 text-xs fixed bottom-0 right-0 z-50">
      <button onClick={toggleWhatsApp} className="bg-gray-200 px-2 py-1 rounded">
        Toggle WhatsApp {whatsAppConnected ? "Off" : "On"}
      </button>
    </div>
  );
};

export default DeveloperControls;
