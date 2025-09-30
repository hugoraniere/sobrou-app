import { supabase } from '@/integrations/supabase/client';

export interface ReleaseNote {
  id: string;
  name: string;
  title: string;
  description?: string;
  image_url?: string;
  image_position: 'left' | 'center' | 'right';
  size: 'small' | 'medium' | 'large';
  cta_text?: string;
  cta_url?: string;
  secondary_button_text: string;
  secondary_button_action: 'close' | 'custom_link';
  secondary_button_url?: string;
  is_active: boolean;
  version: string;
  display_behavior: 'once' | 'every_login' | 'on_dismiss';
  created_at: string;
  updated_at: string;
}

export interface ReleaseNoteDismissal {
  id: string;
  user_id: string;
  release_note_id: string;
  dismissed_at: string;
}

export class ReleaseNotesService {
  // Admin functions
  static async getAllReleaseNotes(): Promise<ReleaseNote[]> {
    const { data, error } = await supabase
      .from('release_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ReleaseNote[];
  }

  static async createReleaseNote(note: Omit<ReleaseNote, 'id' | 'created_at' | 'updated_at'>): Promise<ReleaseNote> {
    const { data, error } = await supabase
      .from('release_notes')
      .insert(note)
      .select()
      .single();

    if (error) throw error;
    return data as ReleaseNote;
  }

  static async updateReleaseNote(id: string, updates: Partial<ReleaseNote>): Promise<ReleaseNote> {
    const { data, error } = await supabase
      .from('release_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ReleaseNote;
  }

  static async deleteReleaseNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('release_notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Função de upload de imagem atualizada para usar otimização
  static async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketName', 'landing-page');
      formData.append('uploadSource', 'release-notes');
      formData.append('category', 'release-notes');
      formData.append('altText', 'Release note image');
      formData.append('tags', JSON.stringify(['release-notes', 'announcement']));

      const { data, error } = await supabase.functions.invoke('optimize-image', {
        body: formData
      });

      if (error) {
        console.error('Error in optimize-image function:', error);
        throw new Error('Erro ao fazer upload da imagem');
      }

      if (!data.success) {
        console.error('Optimization failed:', data.error);
        throw new Error(data.error);
      }

      return data.data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Public functions
  static async getActiveReleaseNote(): Promise<ReleaseNote | null> {
    const { data, error } = await supabase
      .from('release_notes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    return data as ReleaseNote;
  }

  static async dismissReleaseNote(releaseNoteId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('release_note_dismissals')
      .insert({
        user_id: user.id,
        release_note_id: releaseNoteId
      });

    if (error && error.code !== '23505') { // Ignore unique constraint violations
      throw error;
    }
  }

  static async isReleaseNoteDismissed(releaseNoteId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('release_note_dismissals')
      .select('id')
      .eq('user_id', user.id)
      .eq('release_note_id', releaseNoteId)
      .limit(1);

    if (error) throw error;
    return (data?.length || 0) > 0;
  }

  static async getUndismissedActiveReleaseNote(): Promise<ReleaseNote | null> {
    const activeNote = await this.getActiveReleaseNote();
    if (!activeNote) return null;

    // Handle different display behaviors
    if (activeNote.display_behavior === 'every_login') {
      return activeNote; // Always show on every login
    }
    
    if (activeNote.display_behavior === 'on_dismiss') {
      return activeNote; // Always show until user dismisses
    }
    
    // Default behavior: show once per user
    const isDismissed = await this.isReleaseNoteDismissed(activeNote.id);
    return isDismissed ? null : activeNote;
  }
}