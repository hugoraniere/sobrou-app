
import React from 'react';
import { Button } from "@/components/ui/button";

interface FilterProps {
  activeFilter: {
    timeRange: string;
    category: string;
    minAmount: string;
    maxAmount: string;
  };
  setActiveFilter: React.Dispatch<React.SetStateAction<{
    timeRange: string;
    category: string;
    minAmount: string;
    maxAmount: string;
  }>>;
  categories: { value: string; label: string }[];
}

export const ExpenseFilters: React.FC<FilterProps> = ({ 
  activeFilter, 
  setActiveFilter, 
  categories 
}) => {
  const timeRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const handleTimeRangeChange = (timeRange: string) => {
    setActiveFilter(prev => ({ ...prev, timeRange }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveFilter(prev => ({ ...prev, category: e.target.value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setActiveFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setActiveFilter({
      timeRange: 'all',
      category: 'all',
      minAmount: '',
      maxAmount: ''
    });
  };

  return (
    <div className="p-4 border-b bg-gray-50">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Range</label>
          <div className="flex flex-wrap gap-2">
            {timeRanges.map(range => (
              <Button
                key={range.value}
                variant={activeFilter.timeRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeRangeChange(range.value)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2 md:min-w-[150px]">
          <label htmlFor="category" className="text-sm font-medium">Category</label>
          <select
            id="category"
            value={activeFilter.category}
            onChange={handleCategoryChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount Range</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="minAmount"
              placeholder="Min"
              value={activeFilter.minAmount}
              onChange={handleAmountChange}
              className="w-20 md:w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
            <span>to</span>
            <input
              type="number"
              name="maxAmount"
              placeholder="Max"
              value={activeFilter.maxAmount}
              onChange={handleAmountChange}
              className="w-20 md:w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
          </div>
        </div>
        
        <div className="self-end">
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
