
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Target, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Redirect to the main landing page
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Redirecting to home page...</h1>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
