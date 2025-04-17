
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Manage your finances with simplicity through WhatsApp</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            FinanceBot helps you track expenses effortlessly - just send a message and we'll do the rest.
            <span className="block mt-2 font-medium">100% Free to use.</span>
          </p>
          <Button size="lg" className="px-8">
            Create Your Free Account and Connect WhatsApp
          </Button>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">Why people choose FinanceBot</h2>
          
          <Card className="border border-gray-100 shadow-none">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 text-left">Feature</th>
                      <th className="px-6 py-4 text-center">FinanceBot</th>
                      <th className="px-6 py-4 text-center">Spreadsheet</th>
                      <th className="px-6 py-4 text-center">Traditional Apps</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-6 py-4">Input Method</td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">✅ Chat-based input</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center">
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">❌ Manual entry</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">😐 Complex UI</span>
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-6 py-4">Categorization</td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">✅ Auto-categorization</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center">
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">❌ No automation</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">😐 Requires setup</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Insights</td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">✅ AI Insights</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center">
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">❌ None</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">✅ Some</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-100">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-xl font-semibold mb-2">Simple chat interface</h3>
            <p className="text-gray-600">Just send a message like "Spent $30 on lunch" via WhatsApp and we'll handle the rest.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-100">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-powered analysis</h3>
            <p className="text-gray-600">Get smart insights about your spending habits without any manual work.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-100">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">Visual reports</h3>
            <p className="text-gray-600">See where your money goes with clear charts and actionable recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
