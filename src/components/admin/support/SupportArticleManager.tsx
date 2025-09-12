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

interface SupportArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  topic_id: string;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

interface SupportTopic {
  id: string;
  title: string;
}

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
    summary: '',
    topic_id: '',
    is_popular: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // TODO: Implementar busca do Supabase
      // Mock data for now
      setTopics([
        { id: '1', title: 'Primeiros Passos' },
        { id: '2', title: 'WhatsApp' }
      ]);
      
      setArticles([
        {
          id: '1',
          title: 'Como começar a usar o sistema',
          content: 'Guia completo para iniciantes...',
          summary: 'Primeiros passos no sistema',
          topic_id: '1',
          is_popular: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        message: "Erro ao carregar artigos",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingArticle) {
        setArticles(articles.map(article => 
          article.id === editingArticle.id 
            ? { ...article, ...formData, updated_at: new Date().toISOString() }
            : article
        ));
        toast({
          message: "Artigo atualizado com sucesso!",
          type: "success"
        });
      } else {
        const newArticle: SupportArticle = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
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
      summary: '',
      topic_id: '',
      is_popular: false
    });
  };

  const handleEdit = (article: SupportArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      summary: article.summary,
      topic_id: article.topic_id,
      is_popular: article.is_popular
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      try {
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
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = topicFilter === 'all' || article.topic_id === topicFilter;
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
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Breve resumo do artigo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <Select value={formData.topic_id} onValueChange={(value) => setFormData({ ...formData, topic_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map(topic => (
                      <SelectItem key={topic.id} value={topic.id}>{topic.title}</SelectItem>
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
                  id="is_popular"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                />
                <label htmlFor="is_popular" className="text-sm">Artigo popular</label>
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
                  <SelectItem key={topic.id} value={topic.id}>{topic.title}</SelectItem>
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
                      {article.is_popular && (
                        <Badge variant="secondary">Popular</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{article.summary}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Categoria: {topics.find(t => t.id === article.topic_id)?.title}</span>
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