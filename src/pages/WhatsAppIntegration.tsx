
import React, { useState } from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, PhoneCall, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const WhatsAppIntegration = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsConnecting(true);
    
    // Simulate API call
    try {
      // In a real app, this would be an actual API call to connect WhatsApp
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast.success("WhatsApp connected successfully!");
    } catch (error) {
      toast.error("Failed to connect WhatsApp. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Connect Your WhatsApp</h1>
            <p className="text-gray-600">Link your WhatsApp to start tracking expenses automatically</p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>WhatsApp Connection</CardTitle>
              <CardDescription>
                Enter your phone number to receive a verification message
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <form onSubmit={handleConnect} className="space-y-4">
                  <div>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-gray-50 border border-r-0 rounded-l-md">
                        <PhoneCall className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        type="tel"
                        placeholder="Your WhatsApp phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Include country code (e.g. +1 for US)
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={isConnecting} className="w-full">
                    {isConnecting ? "Connecting..." : "Connect WhatsApp"}
                  </Button>
                </form>
              ) : (
                <div className="py-4">
                  <div className="flex items-center space-x-2 text-green-600 mb-4">
                    <Check className="h-6 w-6" />
                    <span className="font-medium">WhatsApp Connected Successfully!</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Your WhatsApp account is now linked to FinanceBot. You can start sending your
                    expenses right away.
                  </p>
                  
                  <Link to="/">
                    <Button className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">How it works</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-4 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">Send messages with your expenses</h3>
                  <p className="text-gray-600">
                    Simply text your expenses like "Spent $25 on dinner" or "Uber ride $12"
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-4 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">AI categorizes expenses automatically</h3>
                  <p className="text-gray-600">
                    We'll extract the amount, category, and description from your message
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-4 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">View your financial dashboard</h3>
                  <p className="text-gray-600">
                    See your spending patterns, get insights, and receive saving suggestions
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Example messages</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>"Spent $45.50 on groceries at Walmart"</li>
                    <li>"$12 lunch today"</li>
                    <li>"Rent payment $1200"</li>
                    <li>"Uber ride yesterday $18.75"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhatsAppIntegration;
