import { supabase } from '@/integrations/supabase/client';
import type { 
  OnboardingAnchor, 
  CreateAnchorData, 
  UpdateAnchorData, 
  AnchorSearchParams,
  AnchorSearchResult 
} from '@/types/onboarding-anchors';

export class AnchorService {
  private static readonly BUCKET_NAME = 'onboarding-thumbs';

  // CRUD Operations
  static async searchAnchors(params: AnchorSearchParams = {}): Promise<AnchorSearchResult> {
    const {
      route,
      query = '',
      kind,
      limit = 20,
      offset = 0
    } = params;

    try {
      const { data, error } = await supabase.rpc('anchors_search', {
        route_filter: route || null,
        search_query: query,
        kind_filter: kind || null,
        limit_count: limit,
        offset_count: offset
      });

      if (error) throw error;

      const anchors = data as OnboardingAnchor[];
      const hasMore = anchors.length === limit;

      return {
        anchors,
        total: anchors.length + offset,
        hasMore
      };
    } catch (error) {
      console.error('Error searching anchors:', error);
      throw error;
    }
  }

  static async getAllAnchors(): Promise<OnboardingAnchor[]> {
    try {
      const { data, error } = await supabase
        .from('onboarding_anchors')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as OnboardingAnchor[];
    } catch (error) {
      console.error('Error fetching all anchors:', error);
      throw error;
    }
  }

  static async getAnchorsByRoute(route: string): Promise<OnboardingAnchor[]> {
    try {
      const { data, error } = await supabase
        .from('onboarding_anchors')
        .select('*')
        .eq('route', route)
        .order('friendly_name');

      if (error) throw error;
      return data as OnboardingAnchor[];
    } catch (error) {
      console.error('Error fetching anchors by route:', error);
      throw error;
    }
  }

  static async getAnchorById(id: string): Promise<OnboardingAnchor | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_anchors')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as OnboardingAnchor | null;
    } catch (error) {
      console.error('Error fetching anchor by id:', error);
      throw error;
    }
  }

  static async getAnchorByAnchorId(anchorId: string): Promise<OnboardingAnchor | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_anchors')
        .select('*')
        .eq('anchor_id', anchorId)
        .maybeSingle();

      if (error) throw error;
      return data as OnboardingAnchor | null;
    } catch (error) {
      console.error('Error fetching anchor by anchor_id:', error);
      throw error;
    }
  }

  static async createAnchor(anchorData: CreateAnchorData): Promise<OnboardingAnchor | null> {
    try {
      // Verificar se o anchor_id já existe
      const existing = await this.getAnchorByAnchorId(anchorData.anchor_id);
      if (existing) {
        throw new Error(`Anchor ID '${anchorData.anchor_id}' já existe`);
      }

      const { data, error } = await supabase
        .from('onboarding_anchors')
        .insert({
          ...anchorData,
          kind: anchorData.kind || 'outro'
        })
        .select()
        .single();

      if (error) throw error;
      return data as OnboardingAnchor;
    } catch (error) {
      console.error('Error creating anchor:', error);
      throw error;
    }
  }

  static async updateAnchor(id: string, updates: UpdateAnchorData): Promise<OnboardingAnchor | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_anchors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as OnboardingAnchor;
    } catch (error) {
      console.error('Error updating anchor:', error);
      throw error;
    }
  }

  static async deleteAnchor(id: string): Promise<boolean> {
    try {
      // Buscar a âncora para obter a thumb_url antes de deletar
      const anchor = await this.getAnchorById(id);
      
      const { error } = await supabase
        .from('onboarding_anchors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Deletar o thumbnail se existir
      if (anchor?.thumb_url) {
        await this.deleteThumbnail(anchor.thumb_url);
      }

      return true;
    } catch (error) {
      console.error('Error deleting anchor:', error);
      throw error;
    }
  }

  // Thumbnail Management
  static async uploadThumbnail(
    anchorId: string, 
    imageBlob: Blob, 
    route: string
  ): Promise<string> {
    try {
      // Criar path: route/anchor_id.png
      const fileName = `${route.replace(/[^a-zA-Z0-9]/g, '_')}/${anchorId}.png`;
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, imageBlob, {
          contentType: 'image/png',
          upsert: true
        });

      if (error) throw error;

      // Gerar URL pública
      const { data: publicUrlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  }

  static async deleteThumbnail(thumbUrl: string): Promise<boolean> {
    try {
      // Extrair o path do URL
      const url = new URL(thumbUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts.slice(-2).join('/'); // route/anchor_id.png

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.warn('Warning deleting thumbnail:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Warning deleting thumbnail:', error);
      return false;
    }
  }

  // Utility Methods
  static generateAnchorId(route: string, friendlyName: string): string {
    // Gerar anchor_id único baseado na rota e nome amigável
    const routeSlug = route.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const nameSlug = friendlyName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    
    const baseId = `${routeSlug}--${nameSlug}`;
    const timestamp = Date.now().toString().slice(-6); // últimos 6 dígitos
    
    return `${baseId}--${timestamp}`;
  }

  static extractFriendlyName(element: Element): string {
    // Heurística para extrair nome amigável
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const textContent = element.textContent?.trim();
    if (textContent && textContent.length < 50) return textContent;

    const placeholder = (element as HTMLInputElement).placeholder;
    if (placeholder) return placeholder;

    const title = element.getAttribute('title');
    if (title) return title;

    const role = element.getAttribute('role');
    if (role) return `Elemento ${role}`;

    return `Elemento ${element.tagName.toLowerCase()}`;
  }

  static detectKind(element: Element): 'botao' | 'input' | 'grafico' | 'card' | 'outro' {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const className = element.className.toLowerCase();

    // Detectar botões
    if (tagName === 'button' || role === 'button' || className.includes('button') || className.includes('btn')) {
      return 'botao';
    }

    // Detectar inputs
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || role === 'textbox') {
      return 'input';
    }

    // Detectar gráficos
    if (tagName === 'canvas' || tagName === 'svg' || className.includes('chart') || className.includes('graph')) {
      return 'grafico';
    }

    // Detectar cards
    if (className.includes('card') || role === 'article' || role === 'region') {
      return 'card';
    }

    return 'outro';
  }

  static async markAsVerified(anchorId: string): Promise<void> {
    try {
      await supabase
        .from('onboarding_anchors')
        .update({ last_verified_at: new Date().toISOString() })
        .eq('anchor_id', anchorId);
    } catch (error) {
      console.warn('Warning updating verification timestamp:', error);
    }
  }
}