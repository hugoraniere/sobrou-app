import React from 'react';
import { useLocation } from 'react-router-dom';
import { useProductTour } from '@/contexts/ProductTourProvider';
import { useAuth } from '@/contexts/AuthContext';
import { TourSpotlight } from './TourSpotlight';

export const TourManager: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Lista de rotas onde o tour NÃO deve aparecer
  const excludedRoutes = ['/auth', '/reset-password', '/verify', '/erro', '/blog', '/suporte'];
  const isExcludedRoute = excludedRoutes.some(route => location.pathname.startsWith(route));
  const isRootRoute = location.pathname === '/';

  // Não renderizar o tour se:
  // 1. Usuário não está autenticado E está em rota pública
  // 2. Está em rota excluída
  // 3. Está na raiz (landing page) sem estar autenticado
  if ((!isAuthenticated && (isRootRoute || isExcludedRoute)) || isExcludedRoute) {
    return null;
  }

  // Usar try-catch para capturar erro de contexto
  let tourContext;
  try {
    tourContext = useProductTour();
  } catch (error) {
    // Se o contexto não estiver disponível, não renderizar
    console.warn('ProductTour context not available:', error);
    return null;
  }

  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    isFirstStep,
    isLastStep,
  } = tourContext;

  // Don't render if tour is not active or no current step
  if (!isActive || !currentStep) {
    return null;
  }

  const handleNext = () => {
    if (isLastStep) {
      completeTour();
    } else {
      nextStep();
    }
  };

  const handleClose = () => {
    if (isLastStep) {
      completeTour();
    } else {
      skipTour();
    }
  };

  return (
    <TourSpotlight
      step={currentStep}
      onNext={handleNext}
      onPrevious={previousStep}
      onSkip={skipTour}
      onClose={handleClose}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      currentStepIndex={currentStepIndex}
      totalSteps={totalSteps}
    />
  );
};