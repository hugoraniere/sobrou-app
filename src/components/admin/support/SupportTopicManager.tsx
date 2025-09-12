import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SupportTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  created_at: string;
}

const SupportTopicManager = () => {
  const [topics, setTopics] = useState<SupportTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<SupportTopic | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '❓'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    try {
      // TODO: Implementar busca de tópicos do Supabase
      // const { data, error } = await supabase
      //   .from('support_topics')
      //   .select('*')
      //   .order('order_index');
      
      // Mock data for now
      setTopics([
        {
          id: '1',
          title: 'Primeiros Passos',
          description: 'Como começar a usar o sistema',
          icon: '🚀',
          order_index: 1,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'WhatsApp',
          description: 'Configuração e uso do WhatsApp',
          icon: '💬',
          order_index: 2,
          created_at: '2024-01-15T10:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        message: "Erro ao carregar categorias",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTopic) {
        // TODO: Implementar atualização no Supabase
        setTopics(topics.map(topic => 
          topic.id === editingTopic.id 
            ? { ...topic, ...formData }
            : topic
        ));
        toast({
          message: "Categoria atualizada com sucesso!",
          type: "success"
        });
      } else {
        // TODO: Implementar criação no Supabase
        const newTopic: SupportTopic = {
          id: Date.now().toString(),
          ...formData,
          order_index: topics.length + 1,
          created_at: new Date().toISOString()
        };
        setTopics([...topics, newTopic]);
        toast({
          message: "Categoria criada com sucesso!",
          type: "success"
        });
      }
      
      setIsDialogOpen(false);
      setEditingTopic(null);
      setFormData({ title: '', description: '', icon: '❓' });
    } catch (error) {
      toast({
        message: "Erro ao salvar categoria",
        type: "error"
      });
    }
  };

  const handleEdit = (topic: SupportTopic) => {
    setEditingTopic(topic);
    setFormData({
      title: topic.title,
      description: topic.description,
      icon: topic.icon
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        // TODO: Implementar exclusão no Supabase
        setTopics(topics.filter(topic => topic.id !== id));
        toast({
          message: "Categoria excluída com sucesso!",
          type: "success"
        });
      } catch (error) {
        toast({
          message: "Erro ao excluir categoria",
          type: "error"
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando categorias...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categorias de Suporte</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTopic(null);
              setFormData({ title: '', description: '', icon: '❓' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTopic ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Primeiros Passos"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição da categoria"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ícone (emoji)</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🚀"
                  maxLength={2}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTopic ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <span className="flex-1">{topic.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{topic.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(topic)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(topic.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {topics.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhuma categoria criada ainda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupportTopicManager;