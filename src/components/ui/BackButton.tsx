import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Voltar
    </Button>
  );
};

export default BackButton;