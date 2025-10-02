import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProductTour } from '@/contexts/ProductTourProvider';
import SearchInput from './SearchInput';

interface SupportSearchAndActionsProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SupportSearchAndActions: React.FC<SupportSearchAndActionsProps> = ({
  onSearch,
  className = ""
}) => {
  const { user } = useAuth();
  const { startTour, isActive } = useProductTour();

  const handleStartTour = () => {
    startTour();
  };

  return (
    <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 ${className}`}>
      {/* Search Input - Left Side */}
      <div className="flex-1 lg:max-w-xl">
        <SearchInput 
          onSearch={onSearch}
          className="w-full"
        />
      </div>
      
      {/* Action Buttons - Right Side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {user && (
          <Button 
            variant="outline" 
            size="default" 
            onClick={handleStartTour}
            disabled={isActive}
            className="shadow-sm"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Fazer Tour
          </Button>
        )}
        
        <Link to={user ? "/suporte/novo" : "/?auth=1&redirect=/suporte/novo"}>
          <Button variant="default" size="default" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Ticket
          </Button>
        </Link>
        
        {user && (
          <Link to="/suporte/meus-tickets">
            <Button variant="secondary" size="default" className="shadow-sm">
              <FileText className="h-4 w-4 mr-2" />
              Meus Tickets
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SupportSearchAndActions;