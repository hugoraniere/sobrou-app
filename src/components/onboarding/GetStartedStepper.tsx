import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Eye, EyeOff } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingService } from '@/services/OnboardingService';

export const GetStartedStepper: React.FC = () => {
  const { 
    steps, 
    progress, 
    eventCounts, 
    isStepperMinimized, 
    minimizeStepper, 
    showStepper, 
    trackEvent 
  } = useOnboarding();
  const navigate = useNavigate();

  if (steps.length === 0) return null;

  const completedSteps = steps.filter(step => 
    progress?.completed[step.key] || OnboardingService.shouldCompleteStep(step, eventCounts)
  );

  const completionPercentage = OnboardingService.getCompletionPercentage(steps, progress, eventCounts);
  const allCompleted = completedSteps.length === steps.length;

  if (allCompleted) return null; // Hide when all steps are completed

  // Minimized state - show pill in header
  if (isStepperMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={showStepper}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          <Eye className="w-4 h-4 mr-2" />
          Get Started ({completedSteps.length}/{steps.length})
        </Button>
      </div>
    );
  }

  const handleStepClick = async (step: any) => {
    await trackEvent(`step_opened_${step.key}`);
    navigate(step.action_path);
  };

  const isStepCompleted = (step: any) => {
    return progress?.completed[step.key] || OnboardingService.shouldCompleteStep(step, eventCounts);
  };

  const getStepStatus = (step: any, index: number) => {
    if (isStepCompleted(step)) return 'completed';
    
    // Find first incomplete step
    const firstIncompleteIndex = steps.findIndex(s => !isStepCompleted(s));
    if (index === firstIncompleteIndex) return 'active';
    
    return 'pending';
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20" data-tour-id="dashboard.onboarding.stepper">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Get Started</h3>
            <p className="text-sm text-muted-foreground">
              Complete estas tarefas para aproveitar melhor o Sobrou
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {completedSteps.length}/{steps.length} concluído
            </Badge>
            <Button
              onClick={minimizeStepper}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="Ocultar Get Started"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Steps grid - responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            
            return (
              <div
                key={step.key}
                className={`
                  p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer
                  ${isCompleted ? 'bg-primary/5 border-primary/30' : 
                    isActive ? 'bg-orange-50 border-orange-200' : 
                    'bg-background border-border hover:border-primary/30'}
                `}
                onClick={() => handleStepClick(step)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-muted-foreground'}`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm mb-1 ${isCompleted ? 'text-primary' : 'text-foreground'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {step.description}
                    </p>
                    
                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        className="text-xs h-7"
                      >
                        Ir agora
                      </Button>
                    )}

                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        ✅ Concluído
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};