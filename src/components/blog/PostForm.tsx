import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BlogService } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost, CreateBlogPostData, UpdateBlogPostData } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Save, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const postSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  cover_image_url: z.string().optional(),
  tags: z.array(z.string()).default([])
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  post?: BlogPost;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [content, setContent] = useState(post?.content || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      subtitle: post?.subtitle || '',
      content: post?.content || '',
      cover_image_url: post?.cover_image_url || '',
      tags: post?.tags?.map(tag => tag.name) || []
    }
  });

  const watchedTags = watch('tags');

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        subtitle: post.subtitle || '',
        content: post.content,
        cover_image_url: post.cover_image_url || '',
        tags: post.tags?.map(tag => tag.name) || []
      });
      setContent(post.content);
    }
  }, [post, reset]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await BlogService.uploadImage(file, 'covers');
      setValue('cover_image_url', imageUrl);
      toast({
        message: 'Imagem enviada com sucesso!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        message: 'Erro ao enviar imagem',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      setValue('tags', [...watchedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      const postData = {
        ...data,
        content: content
      };

      if (post) {
        await BlogService.updateBlogPost({ ...postData, id: post.id } as UpdateBlogPostData);
        toast({
          message: 'Post atualizado com sucesso!',
          type: 'success'
        });
      } else {
        await BlogService.createBlogPost(postData as CreateBlogPostData);
        toast({
          message: 'Post criado com sucesso!',
          type: 'success'
        });
        reset();
        setContent('');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        message: 'Erro ao salvar post',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {post ? 'Editar Post' : 'Novo Post'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Digite o título do post"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              {...register('subtitle')}
              placeholder="Digite o subtítulo (opcional)"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Imagem de Capa</Label>
            <div className="flex gap-2">
              <Input
                {...register('cover_image_url')}
                placeholder="URL da imagem ou faça upload"
                readOnly={isUploading}
              />
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  className="pointer-events-none"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? 'Enviando...' : 'Upload'}
                </Button>
              </div>
            </div>
            {watch('cover_image_url') && (
              <div className="mt-2">
                <img
                  src={watch('cover_image_url')}
                  alt="Preview"
                  className="max-w-xs rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Conteúdo *</Label>
            <div className="min-h-[300px]">
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                theme="snow"
                placeholder="Escreva o conteúdo do post..."
              />
            </div>
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Digite uma tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {watchedTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;