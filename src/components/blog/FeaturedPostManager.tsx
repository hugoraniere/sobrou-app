import React, { useState, useEffect } from 'react';
import { BlogService } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Star, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeaturedPostManagerProps {}

const FeaturedPostManager: React.FC<FeaturedPostManagerProps> = () => {
  const { toast } = useToast();
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'post', // 'post' ou 'custom'
    post_id: '',
    title: '',
    description: '',
    image_url: '',
    cta_text: '',
    cta_url: '',
    display_order: 1,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [featuredData, postsData] = await Promise.all([
        BlogService.getFeaturedPosts(),
        BlogService.getBlogPosts()
      ]);
      
      setFeaturedPosts(featuredData);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        message: 'Erro ao carregar dados',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (formData.type === 'post' && !formData.post_id) {
      toast({
        message: 'Selecione um post para destacar',
        type: 'error'
      });
      return;
    }

    if (formData.type === 'custom' && (!formData.title || !formData.description)) {
      toast({
        message: 'Título e descrição são obrigatórios para conteúdo personalizado',
        type: 'error'
      });
      return;
    }

    setCreating(true);
    try {
      const payload = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_custom: formData.type === 'custom'
      };

      await BlogService.createFeaturedPost(payload);
      
      toast({
        message: 'Conteúdo em destaque criado com sucesso!',
        type: 'success'
      });
      
      setShowCreateForm(false);
      setFormData({
        type: 'post',
        post_id: '',
        title: '',
        description: '',
        image_url: '',
        cta_text: '',
        cta_url: '',
        display_order: 1,
        start_date: '',
        end_date: ''
      });
      
      await loadData();
    } catch (error) {
      console.error('Error creating featured content:', error);
      toast({
        message: 'Erro ao criar conteúdo em destaque',
        type: 'error'
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este post do destaque?')) {
      return;
    }

    try {
      await BlogService.deleteFeaturedPost(id);
      toast({
        message: 'Post removido do destaque!',
        type: 'success'
      });
      await loadData();
    } catch (error) {
      console.error('Error deleting featured post:', error);
      toast({
        message: 'Erro ao remover post do destaque',
        type: 'error'
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await BlogService.updateFeaturedPost(id, { is_active: !currentStatus });
      toast({
        message: `Post ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`,
        type: 'success'
      });
      await loadData();
    } catch (error) {
      console.error('Error updating featured post:', error);
      toast({
        message: 'Erro ao atualizar status',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts em Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Posts em Destaque
          </CardTitle>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Destaque
          </Button>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Criar Post em Destaque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tipo de Conteúdo</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      type: value as 'post' | 'custom',
                      post_id: value === 'custom' ? '' : prev.post_id
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post do Blog</SelectItem>
                      <SelectItem value="custom">Conteúdo Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'post' ? (
                  <div>
                    <Label>Selecionar Post</Label>
                    <Select
                      value={formData.post_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, post_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um post" />
                      </SelectTrigger>
                      <SelectContent>
                        {posts.map((post) => (
                          <SelectItem key={post.id} value={post.id}>
                            {post.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Promoção Especial de Natal"
                        required={formData.type === 'custom'}
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição do conteúdo em destaque"
                        required={formData.type === 'custom'}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>URL da Imagem (opcional)</Label>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Texto do CTA (opcional)</Label>
                    <Input
                      value={formData.cta_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                      placeholder="Ex: Saiba mais"
                    />
                  </div>
                  <div>
                    <Label>URL do CTA (opcional)</Label>
                    <Input
                      value={formData.cta_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, cta_url: e.target.value }))}
                      placeholder="Ex: https://exemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Ordem de Exibição</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.display_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div>
                    <Label>Data de Início (opcional)</Label>
                    <Input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Data de Fim (opcional)</Label>
                    <Input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreate} disabled={creating}>
                    {creating ? 'Criando...' : 'Criar Destaque'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {featuredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum post em destaque configurado.</p>
              <p className="text-sm">Clique em "Novo Destaque" para começar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {featuredPosts.map((featured) => (
                <Card key={featured.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
							<h4 className="font-semibold">
                            {featured.is_custom ? featured.title : (featured.blog_posts?.title || 'Post não encontrado')}
                          </h4>
                          <Badge variant={featured.is_active ? "default" : "secondary"}>
                            {featured.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Badge variant="outline">
                            Ordem {featured.display_order}
                          </Badge>
                        </div>
                        
                        {featured.cta_text && (
                          <p className="text-sm text-muted-foreground mb-1">
                            CTA: {featured.cta_text}
                            {featured.cta_url && (
                              <span className="ml-2">
                                → <a href={featured.cta_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {featured.cta_url}
                                </a>
                              </span>
                            )}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Criado: {format(new Date(featured.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </span>
                          </div>
                          {featured.start_date && (
                            <span>
                              Início: {format(new Date(featured.start_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </span>
                          )}
                          {featured.end_date && (
                            <span>
                              Fim: {format(new Date(featured.end_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(featured.id, featured.is_active)}
                        >
                          {featured.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(featured.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedPostManager;