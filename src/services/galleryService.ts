import { supabase } from '@/integrations/supabase/client';

export interface GalleryImage {
  name: string;
  path: string;
  size: number;
  created_at: string;
  updated_at: string;
  metadata?: {
    mimetype?: string;
    size?: number;
    cacheControl?: string;
  };
  publicUrl: string;
}

class GalleryService {
  private bucketName = 'landing-page';

  // Listar todas as imagens
  async getAllImages(): Promise<GalleryImage[]> {
    try {
      const { data: files, error } = await supabase.storage
        .from(this.bucketName)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching images:', error);
        return [];
      }

      return files
        .filter(file => file.name && file.metadata?.mimetype?.startsWith('image/'))
        .map(file => ({
          name: file.name,
          path: file.name,
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          updated_at: file.updated_at,
          metadata: file.metadata,
          publicUrl: this.getPublicUrl(file.name)
        }));
    } catch (error) {
      console.error('Error in getAllImages:', error);
      return [];
    }
  }

  // Upload de nova imagem
  async uploadImage(file: File, fileName?: string): Promise<string | null> {
    try {
      const finalFileName = fileName || `${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(finalFileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      return this.getPublicUrl(data.path);
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  }

  // Renomear imagem
  async renameImage(oldName: string, newName: string): Promise<boolean> {
    try {
      // Primeiro, baixar o arquivo
      const { data: downloadData, error: downloadError } = await supabase.storage
        .from(this.bucketName)
        .download(oldName);

      if (downloadError || !downloadData) {
        console.error('Error downloading file for rename:', downloadError);
        return false;
      }

      // Upload com novo nome
      const { error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(newName, downloadData, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading renamed file:', uploadError);
        return false;
      }

      // Deletar arquivo antigo
      const { error: deleteError } = await supabase.storage
        .from(this.bucketName)
        .remove([oldName]);

      if (deleteError) {
        console.error('Error deleting old file:', deleteError);
        // Não retornar false aqui pois o upload do novo foi bem-sucedido
      }

      return true;
    } catch (error) {
      console.error('Error in renameImage:', error);
      return false;
    }
  }

  // Deletar imagem
  async deleteImage(fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([fileName]);

      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteImage:', error);
      return false;
    }
  }

  // Obter URL pública
  getPublicUrl(fileName: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  }

  // Buscar imagens por nome
  async searchImages(query: string): Promise<GalleryImage[]> {
    const allImages = await this.getAllImages();
    
    if (!query.trim()) {
      return allImages;
    }

    const searchTerm = query.toLowerCase();
    return allImages.filter(image => 
      image.name.toLowerCase().includes(searchTerm)
    );
  }

  // Verificar se bucket existe e é público
  async checkBucketStatus(): Promise<{ exists: boolean; isPublic: boolean }> {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        return { exists: false, isPublic: false };
      }

      const bucket = buckets?.find(b => b.id === this.bucketName);
      return {
        exists: !!bucket,
        isPublic: bucket?.public || false
      };
    } catch (error) {
      console.error('Error in checkBucketStatus:', error);
      return { exists: false, isPublic: false };
    }
  }
}

export const galleryService = new GalleryService();