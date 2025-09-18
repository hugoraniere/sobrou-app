export interface AnchorReindexProgress {
  total: number;
  current: number;
  currentAnchor?: string;
  status: 'idle' | 'scanning' | 'processing' | 'completed' | 'error';
  errors: string[];
  updated: number;
  created: number;
  invalid: number;
}

export interface AnchorStatus {
  isValid: boolean;
  lastVerified?: string;
  hasValidSelector: boolean;
  hasThumbnail: boolean;
  needsUpdate: boolean;
}

export interface AnchorMaintenanceEvent {
  type: 'anchor_picker_opened' | 'anchor_search' | 'anchor_selected' | 
        'anchor_created' | 'anchor_renamed' | 'anchor_preview_opened' |
        'anchors_reindexed' | 'anchor_marked_invalid' | 'anchor_archived';
  anchorId?: string;
  route?: string;
  count?: number;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface InvalidAnchorSuggestion {
  element: Element;
  score: number;
  reason: string;
  similarity: {
    text: number;
    role: number;
    position: number;
  };
}

export interface ThumbnailCleanupResult {
  cleaned: number;
  errors: string[];
  totalSize: number;
}