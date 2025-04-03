
import React from 'react';

const EmptyDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Empty Total Expenses */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
        <p className="text-3xl font-bold text-gray-300">$0.00</p>
        
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Insights</h4>
          <p className="text-sm text-gray-400">Add your first expense to see insights</p>
        </div>
      </div>
      
      {/* Empty Category Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Expenses by Category</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded">
          <div className="text-center">
            <p>No expense data to display</p>
            <p className="text-sm mt-2">Start tracking to see your categories</p>
          </div>
        </div>
      </div>
      
      {/* Empty Over Time Chart */}
      <div className="bg-white p-4 rounded-lg shadow md:col-span-3">
        <h3 className="text-lg font-semibold mb-2">Expenses Over Time</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded">
          <div className="text-center">
            <p>Your dashboard is waiting</p>
            <p className="text-sm mt-2">Start by sending your first expense!</p>
          </div>
        </div>
      </div>
      
      {/* Empty Monthly Comparison */}
      <div className="bg-white p-4 rounded-lg shadow md:col-span-3">
        <h3 className="text-lg font-semibold mb-2">Monthly Comparison</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded">
          <div className="text-center">
            <p>Track expenses across months</p>
            <p className="text-sm mt-2">You'll see your spending trends here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyDashboard;
