
import React from 'react';

interface InsightListProps {
  insights: string[];
}

const InsightList: React.FC<InsightListProps> = ({ insights }) => {
  if (insights.length === 0) {
    return (
      <p className="text-sm text-gray-400">Add more expenses to see insights</p>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-500">Insights</h4>
      <ul className="space-y-1">
        {insights.map((insight, index) => (
          <li key={index} className="text-sm flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsightList;
