import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SupportService } from '@/services/supportService';
import type { SupportTopic } from '@/types/support';

const SupportTopicManager = () => {
  const [topics, setTopics] = useState<SupportTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<SupportTopic | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'HelpCircle',
    is_active: true,
    sort_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await SupportService.getAllTopics();
      setTopics(data);
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
        const updatedTopic = await SupportService.updateTopic(editingTopic.id, formData);
        setTopics(topics.map(topic => 
          topic.id === editingTopic.id ? updatedTopic : topic
        ));
        toast({
          message: "Categoria atualizada com sucesso!",
          type: "success"
        });
      } else {
        const newTopic = await SupportService.createTopic(formData);
        setTopics([...topics, newTopic]);
        toast({
          message: "Categoria criada com sucesso!",
          type: "success"
        });
      }
      
      setIsDialogOpen(false);
      setEditingTopic(null);
      setFormData({ name: '', description: '', icon: 'HelpCircle', is_active: true, sort_order: 0 });
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
      name: topic.name,
      description: topic.description || '',
      icon: topic.icon,
      is_active: topic.is_active,
      sort_order: topic.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await SupportService.deleteTopic(id);
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
              setFormData({ name: '', description: '', icon: 'HelpCircle', is_active: true, sort_order: 0 });
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
                <label className="block text-sm font-medium mb-2">Nome</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ícone (Lucide React)</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="HelpCircle"
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
                <span className="flex-1">{topic.name}</span>
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