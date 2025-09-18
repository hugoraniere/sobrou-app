export interface OnboardingAnchor {
  id: string;
  route: string;
  anchor_id: string;
  friendly_name: string;
  selector: string;
  thumb_url?: string;
  width?: number;
  height?: number;
  kind: 'botao' | 'input' | 'grafico' | 'card' | 'outro';
  tags?: string[];
  last_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAnchorData {
  route: string;
  anchor_id: string;
  friendly_name: string;
  selector: string;
  width?: number;
  height?: number;
  kind?: 'botao' | 'input' | 'grafico' | 'card' | 'outro';
  tags?: string[];
}

export interface UpdateAnchorData {
  friendly_name?: string;
  selector?: string;
  thumb_url?: string;
  width?: number;
  height?: number;
  kind?: 'botao' | 'input' | 'grafico' | 'card' | 'outro';
  tags?: string[];
  last_verified_at?: string;
}

export interface AnchorSearchParams {
  route?: string;
  query?: string;
  kind?: 'botao' | 'input' | 'grafico' | 'card' | 'outro';
  limit?: number;
  offset?: number;
}

export interface AnchorSearchResult {
  anchors: OnboardingAnchor[];
  total: number;
  hasMore: boolean;
}