import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, HelpCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      // TODO: Implementar busca de FAQs do Supabase
      // const { data, error } = await supabase
      //   .from('support_faqs')
      //   .select('*')
      //   .order('order_index');
      
      // Mock data for now
      setFaqs([
        {
          id: '1',
          question: 'Como funciona o sistema?',
          answer: 'O sistema funciona de forma simples e intuitiva...',
          order_index: 1,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          question: 'Como conectar o WhatsApp?',
          answer: 'Para conectar o WhatsApp, siga estes passos...',
          order_index: 2,
          created_at: '2024-01-15T11:00:00Z',
          updated_at: '2024-01-15T11:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        message: "Erro ao carregar FAQs",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFaq) {
        // TODO: Implementar atualização no Supabase
        setFaqs(faqs.map(faq => 
          faq.id === editingFaq.id 
            ? { ...faq, ...formData, updated_at: new Date().toISOString() }
            : faq
        ));
        toast({
          message: "FAQ atualizada com sucesso!",
          type: "success"
        });
      } else {
        // TODO: Implementar criação no Supabase
        const newFaq: FAQ = {
          id: Date.now().toString(),
          ...formData,
          order_index: faqs.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setFaqs([...faqs, newFaq]);
        toast({
          message: "FAQ criada com sucesso!",
          type: "success"
        });
      }
      
      setIsDialogOpen(false);
      setEditingFaq(null);
      setFormData({ question: '', answer: '' });
    } catch (error) {
      toast({
        message: "Erro ao salvar FAQ",
        type: "error"
      });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta FAQ?')) {
      try {
        // TODO: Implementar exclusão no Supabase
        setFaqs(faqs.filter(faq => faq.id !== id));
        toast({
          message: "FAQ excluída com sucesso!",
          type: "success"
        });
      } catch (error) {
        toast({
          message: "Erro ao excluir FAQ",
          type: "error"
        });
      }
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Carregando FAQs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perguntas Frequentes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingFaq(null);
              setFormData({ question: '', answer: '' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? 'Editar FAQ' : 'Nova FAQ'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pergunta</label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Digite a pergunta"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Resposta</label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Digite a resposta completa"
                  rows={6}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingFaq ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar perguntas ou respostas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma FAQ encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredFaqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-600 mb-3">{faq.answer}</p>
                    <div className="text-sm text-gray-500">
                      Atualizada: {new Date(faq.updated_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(faq)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(faq.id)}>
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

export default FAQManager;