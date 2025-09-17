export type OnboardingGoal = 'dividas' | 'organizar' | 'cartao';

export type OnboardingStep = 
  | 'personalization'
  | 'quickwin'
  | 'checklist'
  | 'checklist_payable'
  | 'checklist_transactions'
  | 'checklist_budget'
  | 'tour'
  | 'completed';

export interface OnboardingProgress {
  user_id: string;
  goal?: OnboardingGoal;
  effort_minutes?: number;
  steps_completed: string[];
  quickwin_done: boolean;
  created_at: string;
  updated_at: string;
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

export interface OnboardingContext {
  progress: OnboardingProgress | null;
  currentStep: OnboardingStep | null;
  isWelcomeModalOpen: boolean;
  isChecklistOpen: boolean;
  isTourActive: boolean;
  isFirstLogin: boolean;
  
  // Actions
  setWelcomeModalOpen: (open: boolean) => void;
  setChecklistOpen: (open: boolean) => void;
  setTourActive: (active: boolean) => void;
  updateProgress: (updates: Partial<OnboardingProgress>) => Promise<void>;
  completeStep: (step: string) => Promise<void>;
  skipOnboarding: () => Promise<void>;
  restartOnboarding: () => Promise<void>;
}

export interface AnalyticsEvent {
  event_name: string;
  user_id?: string;
  session_id?: string;
  event_params?: Record<string, any>;
  page?: string;
}