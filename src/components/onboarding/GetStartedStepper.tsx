import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Eye, EyeOff } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingService } from '@/services/OnboardingService';
import { OnboardingConfigService } from '@/services/OnboardingConfigService';

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
  
  const [config, setConfig] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const [configData, tasksData] = await Promise.all([
        OnboardingConfigService.getGetStartedConfig(),
        OnboardingConfigService.getGetStartedTasks()
      ]);
      setConfig(configData);
      setTasks(tasksData.filter((task: any) => task.is_active));
    } catch (error) {
      console.error('Error loading Get Started config:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !config || !config.is_enabled || tasks.length === 0) return null;

  const completedTasks = tasks.filter(task => 
    eventCounts[task.completion_event] > 0
  );

  const completionPercentage = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const allCompleted = completedTasks.length === tasks.length;

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
          {config.title} ({completedTasks.length}/{tasks.length})
        </Button>
      </div>
    );
  }

  const handleTaskClick = async (task: any) => {
    if (task.cta_enabled && task.cta_url) {
      await trackEvent(`task_opened_${task.id}`);
      navigate(task.cta_url);
    }
  };

  const isTaskCompleted = (task: any) => {
    return eventCounts[task.completion_event] > 0;
  };

  const getTaskStatus = (task: any, index: number) => {
    if (isTaskCompleted(task)) return 'completed';
    
    // Find first incomplete task
    const firstIncompleteIndex = tasks.findIndex(t => !isTaskCompleted(t));
    if (index === firstIncompleteIndex) return 'active';
    
    return 'pending';
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20" data-tour-id="dashboard.onboarding.stepper">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{config.title}</h3>
            <p className="text-sm text-muted-foreground">
              {config.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {completedTasks.length}/{tasks.length} concluído
            </Badge>
            {config.show_minimize_button && (
              <Button
                onClick={minimizeStepper}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Ocultar Get Started"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {config.show_progress_bar && (
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        )}

        {/* Tasks grid - responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task, index) => {
            const status = getTaskStatus(task, index);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            
            return (
              <div
                key={task.id}
                className={`
                  p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer
                  ${isCompleted ? 'bg-primary/5 border-primary/30' : 
                    isActive ? 'bg-orange-50 border-orange-200' : 
                    'bg-background border-border hover:border-primary/30'}
                `}
                onClick={() => handleTaskClick(task)}
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
                      {task.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {task.description}
                    </p>
                    
                    {!isCompleted && task.cta_enabled && (
                      <Button
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        className="text-xs h-7"
                      >
                        {task.cta_text}
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