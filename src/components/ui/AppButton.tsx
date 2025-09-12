import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppButton: React.FC = () => {
  return (
    <Link to="/dashboard">
      <Button variant="ghost" size="sm">
        Ir para App
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </Link>
  );
};

export default AppButton;