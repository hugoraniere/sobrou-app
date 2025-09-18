
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  className,
  placeholder = "Buscar..."
}) => {
  return (
    <div className={cn("relative w-full max-w-[320px]", className)} data-tour-id="transactions.filters.search-bar">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-white"
      />
    </div>
  );
};

export default SearchBar;
