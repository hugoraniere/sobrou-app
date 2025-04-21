
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

interface OnboardingPanelProps {
  whatsAppConnected: boolean;
}

const OnboardingPanel: React.FC<OnboardingPanelProps> = ({ whatsAppConnected }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center mb-4">
        <span className="text-xl mr-2">👋</span>
        <h2 className="text-xl font-semibold">Welcome! Let's get started with your finances.</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3 flex-grow">
            <span className="font-medium">Create account</span>
            <Link to="/auth" className="md:ml-2">
              <Button size="sm" variant="outline">
                Manage Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${whatsAppConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
            {whatsAppConnected ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <span className="text-gray-500">2</span>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3 flex-grow">
            <span className="font-medium">
              {whatsAppConnected 
                ? "WhatsApp connected successfully!"
                : "Connect your WhatsApp to start tracking expenses"}
            </span>
            {!whatsAppConnected && (
              <Link to="/whatsapp-integration">
                <Button size="sm" className="ml-0 md:ml-4">
                  Connect WhatsApp
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPanel;
