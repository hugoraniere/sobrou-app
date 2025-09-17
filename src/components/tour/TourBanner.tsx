import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, X, Play } from 'lucide-react';
import { useProductTour } from '@/contexts/ProductTourProvider';
import { useAuth } from '@/contexts/AuthContext';
import { ProductTourService } from '@/services/productTourService';

export const TourBanner: React.FC = () => {
  const { user } = useAuth();
  const { startTour, isActive, progress } = useProductTour();
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkShouldShowBanner = async () => {
      if (!user?.id || isActive || isDismissed) return;

      try {
        // Check if tour is enabled
        const tourEnabled = await ProductTourService.isTourEnabled();
        if (!tourEnabled) return;

        // Check if user has completed or skipped tour
        if (progress?.completed_at || progress?.skipped_at) return;

        // Show banner if user hasn't started tour yet, or started but didn't complete
        if (!progress?.started_at || (progress?.started_at && !progress?.completed_at)) {
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error checking tour banner visibility:', error);
      }
    };

    checkShouldShowBanner();
  }, [user?.id, isActive, progress, isDismissed]);

  const handleStartTour = () => {
    setShowBanner(false);
    startTour();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
  };

  if (!showBanner || isActive) {
    return null;
  }

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                Conheça o Sobrou! 🚀
              </h3>
              <p className="text-sm text-text-secondary">
                {progress?.started_at 
                  ? 'Continue de onde parou e complete o tour das funcionalidades'
                  : 'Faça um tour rápido para conhecer todas as funcionalidades'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleStartTour}
              className="gap-2"
            >
              <Play className="h-3 w-3" />
              {progress?.started_at ? 'Continuar Tour' : 'Iniciar Tour'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};