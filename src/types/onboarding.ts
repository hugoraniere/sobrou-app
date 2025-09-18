export interface OnboardingStep {
  id: number;
  key: string;
  title: string;
  description: string;
  icon?: string;
  action_path: string;
  action_hint?: string;
  completion_event: string;
  target_count: number;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingProgress {
  user_id: string;
  completed: Record<string, boolean>;
  minimized: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingContext {
  steps: OnboardingStep[];
  progress: OnboardingProgress | null;
  eventCounts: Record<string, number>;
  isWelcomeModalOpen: boolean;
  isStepperMinimized: boolean;
  
  // Actions
  setWelcomeModalOpen: (open: boolean) => void;
  completeStep: (stepKey: string) => Promise<void>;
  minimizeStepper: () => Promise<void>;
  showStepper: () => Promise<void>;
  trackEvent: (eventName: string, params?: Record<string, any>) => Promise<void>;
  refreshData: () => Promise<void>;
}

export interface Payable {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  due_date: string;
  repeats_monthly: boolean;
  status: 'aberta' | 'paga' | 'vencida';
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  event_name: string;
  user_id?: string;
  event_params?: Record<string, any>;
  page?: string;
}