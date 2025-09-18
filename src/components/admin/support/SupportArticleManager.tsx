import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileText, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SupportService } from '@/services/supportService';
import type { SupportArticle, SupportTopic } from '@/types/support';

const SupportArticleManager = () => {
  const [articles, setArticles] = useState<SupportArticle[]>([]);
  const [topics, setTopics] = useState<SupportTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<SupportArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    topic_id: '',
    is_featured: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [topicsData, articlesData] = await Promise.all([
        SupportService.getAllTopics(),
        SupportService.getAllArticles()
      ]);
      setTopics(topicsData);
      setArticles(articlesData);
    } catch (error) {
      toast({
        message: "Erro ao carregar dados",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const articleData = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        content: formData.content,
        excerpt: formData.excerpt,
        topic_id: formData.topic_id || null,
        status: 'published' as const,
        is_featured: formData.is_featured,
        tags: null,
        created_by: null
      };

      if (editingArticle) {
        const updatedArticle = await SupportService.updateArticle(editingArticle.id, articleData);
        setArticles(articles.map(article => 
          article.id === editingArticle.id ? updatedArticle : article
        ));
        toast({
          message: "Artigo atualizado com sucesso!",
          type: "success"
        });
      } else {
        const newArticle = await SupportService.createArticle(articleData);
        setArticles([...articles, newArticle]);
        toast({
          message: "Artigo criado com sucesso!",
          type: "success"
        });
      }
      
      setIsDialogOpen(false);
      setEditingArticle(null);
      resetForm();
    } catch (error) {
      toast({
        message: "Erro ao salvar artigo",
        type: "error"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      topic_id: '',
      is_featured: false
    });
  };

  const handleEdit = (article: SupportArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      topic_id: article.topic_id || '',
      is_featured: article.is_featured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      try {
        await SupportService.deleteArticle(id);
        setArticles(articles.filter(article => article.id !== id));
        toast({
          message: "Artigo excluído com sucesso!",
          type: "success"
        });
      } catch (error) {
        toast({
          message: "Erro ao excluir artigo",
          type: "error"
        });
      }
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = topicFilter === 'all' || article.topic_id === topicFilter || 
                        (topicFilter === 'none' && !article.topic_id);
    return matchesSearch && matchesTopic;
  });

  if (loading) {
    return <div className="text-center py-8">Carregando artigos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Artigos de Suporte</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingArticle(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? 'Editar Artigo' : 'Novo Artigo'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do artigo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Resumo</label>
                <Input
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Breve resumo do artigo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <Select value={formData.topic_id} onValueChange={(value) => setFormData({ ...formData, topic_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma categoria</SelectItem>
                    {topics.map(topic => (
                      <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Conteúdo</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Conteúdo completo do artigo (suporta Markdown)"
                  rows={8}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <label htmlFor="is_featured" className="text-sm">Artigo em destaque</label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingArticle ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {topics.map(topic => (
                  <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum artigo encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{article.title}</h3>
                      {article.is_featured && (
                        <Badge variant="secondary">Em Destaque</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Categoria: {topics.find(t => t.id === article.topic_id)?.name || 'Nenhuma'}</span>
                      <span>Atualizado: {new Date(article.updated_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportArticleManager;