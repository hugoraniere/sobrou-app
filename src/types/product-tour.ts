export interface ProductTourStep {
  id: string;
  step_key: string;
  title: string;
  description: string;
  anchor_id: string;
  page_route: string;
  step_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTourProgress {
  id: string;
  user_id: string;
  tour_version: string;
  started_at?: string;
  current_step_key?: string;
  completed_at?: string;
  skipped_at?: string;
  total_steps: number;
  completed_steps: number;
  created_at: string;
  updated_at: string;
}

export interface TourEvent {
  id: string;
  user_id?: string;
  session_id?: string;
  event_type: TourEventType;
  step_key?: string;
  page_route?: string;
  event_data: Record<string, any>;
  created_at: string;
}

export type TourEventType = 
  | 'tour_started'
  | 'step_viewed'
  | 'step_completed'
  | 'tour_skipped'
  | 'tour_completed'
  | 'tour_resumed'
  | 'step_skipped'
  | 'navigation_required';

export interface TourSettings {
  id: string;
  setting_key: string;
  setting_value: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TourConfig {
  enabled: boolean;
  auto_start_for_new_users: boolean;
  version: string;
  total_steps: number;
  show_progress: boolean;
  allow_skip: boolean;
}

export interface TourMessages {
  welcome_title: string;
  welcome_description: string;
  completion_title: string;
  completion_description: string;
}

export interface TourContextType {
  // State
  isActive: boolean;
  currentStep: ProductTourStep | null;
  currentStepIndex: number;
  totalSteps: number;
  progress: UserTourProgress | null;
  isLoading: boolean;
  steps: ProductTourStep[];
  
  // Actions
  startTour: () => Promise<void>;
  nextStep: () => Promise<void>;
  previousStep: () => Promise<void>;
  skipTour: () => Promise<void>;
  completeTour: () => Promise<void>;
  goToStep: (stepKey: string) => Promise<void>;
  
  // Utilities
  isFirstStep: boolean;
  isLastStep: boolean;
  canNavigate: boolean;
}

export interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  found: boolean;
}

export interface TourSpotlightProps {
  step: ProductTourStep;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onClose: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepIndex: number;
  totalSteps: number;
}