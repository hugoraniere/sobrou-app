
import React, { useState } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';

const WhatsAppIntegration = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      // In a real application, this would initiate a WhatsApp connection flow
      // For demo purposes, we're just simulating success
      setIsConnected(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect WhatsApp</h1>
          <p className="text-gray-600">
            Link your WhatsApp account to start tracking your expenses via chat.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            {isConnected ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">WhatsApp Connected!</h2>
                <p className="text-gray-600 mb-6">
                  Your WhatsApp account has been successfully connected to FinanceBot.
                </p>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Start Tracking Expenses</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Send messages like these to start tracking your expenses:
                  </p>
                  <div className="bg-gray-50 p-3 rounded mb-4 text-left">
                    <p className="mb-1">💬 <span className="font-medium">Spent 50 on groceries</span></p>
                    <p className="mb-1">💬 <span className="font-medium">Rent 1200</span></p>
                    <p>💬 <span className="font-medium">15.50 coffee yesterday</span></p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsConnected(false)} className="mt-2">
                  Disconnect
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Connect your WhatsApp</h2>
                <p className="text-gray-600 mb-6">
                  Enter your phone number to connect WhatsApp with FinanceBot. You'll receive a verification code.
                </p>
                
                <form onSubmit={handleConnect}>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Connect WhatsApp
                  </Button>
                </form>
                
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">How it works</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                    <li>Enter your phone number and click "Connect WhatsApp"</li>
                    <li>You'll receive a message from our WhatsApp business account</li>
                    <li>Reply to confirm the connection</li>
                    <li>Start sending your expenses directly in chat</li>
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhatsAppIntegration;
