
import React from 'react';
import Header from '../components/Header';

const PublicLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Manage Your Finances with FinanceBot
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The easiest way to track expenses, set budgets, and save money - right from your phone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/auth" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
            <a 
              href="/auth" 
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-200 hover:bg-gray-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
        
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-center mb-12">How FinanceBot Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Connect WhatsApp</h3>
              <p className="text-gray-600">Link your WhatsApp to FinanceBot for easy expense tracking on the go.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Track Expenses</h3>
              <p className="text-gray-600">Send a quick message about your purchases and we'll categorize them automatically.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Get Insights</h3>
              <p className="text-gray-600">View personalized spending reports and get tips to improve your finances.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLanding;
