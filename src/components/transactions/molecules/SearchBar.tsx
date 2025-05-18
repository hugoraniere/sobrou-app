
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Buscar transações...",
  className 
}) => {
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    onSearchChange('');
  };
  
  return (
    <div className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-10 h-9 text-sm"
        />
        {searchTerm && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
