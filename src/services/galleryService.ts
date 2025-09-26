import { supabase } from '@/integrations/supabase/client';

export interface GalleryImage {
  id: string;
  file_name: string;
  original_name: string;
  file_path: string;
  bucket_name: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  tags: string[];
  category: string;
  is_optimized: boolean;
  optimization_level: string;
  formats_available: any; // Using any for now to avoid Json type issues
  seo_score: number;
  upload_source: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  publicUrl: string;
}

export interface ImageUploadOptions {
  altText?: string;
  category?: string;
  tags?: string[];
  uploadSource?: string;
}

class GalleryService {
  private bucketName = 'landing-page';

  // Listar todas as imagens da galeria
  async getAllImages(): Promise<GalleryImage[]> {
    try {
      const { data: images, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery images:', error);
        return [];
      }

      return images.map(image => ({
        ...image,
        publicUrl: this.getPublicUrl(image.file_name)
      }));
    } catch (error) {
      console.error('Error in getAllImages:', error);
      return [];
    }
  }

  // Listar imagens por categoria
  async getImagesByCategory(category: string): Promise<GalleryImage[]> {
    try {
      const { data: images, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching images by category:', error);
        return [];
      }

      return images.map(image => ({
        ...image,
        publicUrl: this.getPublicUrl(image.file_name)
      }));
    } catch (error) {
      console.error('Error in getImagesByCategory:', error);
      return [];
    }
  }

  // Upload otimizado de nova imagem
  async uploadImage(file: File, options: ImageUploadOptions = {}): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketName', this.bucketName);
      formData.append('uploadSource', options.uploadSource || 'manual');
      formData.append('category', options.category || 'general');
      formData.append('altText', options.altText || '');
      formData.append('tags', JSON.stringify(options.tags || []));

      const { data, error } = await supabase.functions.invoke('optimize-image', {
        body: formData
      });

      if (error) {
        console.error('Error in optimize-image function:', error);
        return null;
      }

      if (!data.success) {
        console.error('Optimization failed:', data.error);
        return null;
      }

      return data.data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  }

  // Upload simples (fallback para compatibilidade)
  async uploadImageLegacy(file: File, fileName?: string): Promise<string | null> {
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
      console.error('Error in uploadImageLegacy:', error);
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

  // Buscar imagens por nome, tags, alt text
  async searchImages(query: string): Promise<GalleryImage[]> {
    try {
      if (!query.trim()) {
        return this.getAllImages();
      }

      const { data: images, error } = await supabase
        .from('gallery_images')
        .select('*')
        .or(`original_name.ilike.%${query}%,alt_text.ilike.%${query}%,tags.cs.{${query}}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching images:', error);
        return [];
      }

      return images.map(image => ({
        ...image,
        publicUrl: this.getPublicUrl(image.file_name)
      }));
    } catch (error) {
      console.error('Error in searchImages:', error);
      return [];
    }
  }

  // Atualizar metadados da imagem
  async updateImageMetadata(
    imageId: string,
    updates: Partial<Pick<GalleryImage, 'alt_text' | 'caption' | 'tags' | 'category'>>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', imageId);

      if (error) {
        console.error('Error updating image metadata:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateImageMetadata:', error);
      return false;
    }
  }

  // Obter estatísticas da galeria
  async getGalleryStats(): Promise<{
    totalImages: number;
    totalSize: number;
    optimizedImages: number;
    categories: { [key: string]: number };
  }> {
    try {
      const { data: stats } = await supabase
        .from('gallery_images')
        .select('file_size, is_optimized, category');

      if (!stats) return { totalImages: 0, totalSize: 0, optimizedImages: 0, categories: {} };

      const totalImages = stats.length;
      const totalSize = stats.reduce((sum, img) => sum + img.file_size, 0);
      const optimizedImages = stats.filter(img => img.is_optimized).length;
      
      const categories = stats.reduce((acc, img) => {
        acc[img.category] = (acc[img.category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      return { totalImages, totalSize, optimizedImages, categories };
    } catch (error) {
      console.error('Error in getGalleryStats:', error);
      return { totalImages: 0, totalSize: 0, optimizedImages: 0, categories: {} };
    }
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