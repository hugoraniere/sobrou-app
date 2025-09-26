import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReleaseNotesService, ReleaseNote } from '@/services/releaseNotesService';

const ReleaseNotesAdmin: React.FC = () => {
  const [notes, setNotes] = useState<ReleaseNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ReleaseNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    image_url: '',
    size: 'medium' as 'small' | 'medium' | 'large',
    cta_text: '',
    cta_url: '',
    is_active: false,
    version: '1.0'
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await ReleaseNotesService.getAllReleaseNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading release notes:', error);
      toast({
        description: "Erro ao carregar release notes",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingNote) {
        await ReleaseNotesService.updateReleaseNote(editingNote.id, formData);
        toast({
          description: "Release note atualizada com sucesso"
        });
      } else {
        await ReleaseNotesService.createReleaseNote(formData);
        toast({
          description: "Release note criada com sucesso"
        });
      }

      await loadNotes();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving release note:', error);
      toast({
        description: "Erro ao salvar release note",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (note: ReleaseNote) => {
    setEditingNote(note);
    setFormData({
      name: note.name,
      title: note.title,
      description: note.description || '',
      image_url: note.image_url || '',
      size: note.size,
      cta_text: note.cta_text || '',
      cta_url: note.cta_url || '',
      is_active: note.is_active,
      version: note.version
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta release note?')) return;

    try {
      await ReleaseNotesService.deleteReleaseNote(id);
      await loadNotes();
      toast({
        description: "Release note excluída com sucesso"
      });
    } catch (error) {
      console.error('Error deleting release note:', error);
      toast({
        description: "Erro ao excluir release note",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (note: ReleaseNote) => {
    try {
      // If activating this note, deactivate all others first
      if (!note.is_active) {
        const activeNotes = notes.filter(n => n.is_active);
        for (const activeNote of activeNotes) {
          await ReleaseNotesService.updateReleaseNote(activeNote.id, { is_active: false });
        }
      }

      await ReleaseNotesService.updateReleaseNote(note.id, { is_active: !note.is_active });
      await loadNotes();
      
      toast({
        description: `Release note ${!note.is_active ? 'ativada' : 'desativada'} com sucesso`
      });
    } catch (error) {
      console.error('Error toggling note status:', error);
      toast({
        description: "Erro ao alterar status da release note",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const imageUrl = await ReleaseNotesService.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      toast({
        description: "Imagem enviada com sucesso"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        description: "Erro ao enviar imagem",
        variant: "destructive"
      });
    } finally {
      setImageUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      image_url: '',
      size: 'medium',
      cta_text: '',
      cta_url: '',
      is_active: false,
      version: '1.0'
    });
    setEditingNote(null);
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Pequeno';
      case 'medium': return 'Médio';
      case 'large': return 'Grande';
      default: return size;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Release Notes</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Release Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Editar' : 'Nova'} Release Note
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="size">Tamanho</Label>
                <Select value={formData.size} onValueChange={(value: 'small' | 'medium' | 'large') => setFormData(prev => ({ ...prev, size: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeno</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">Imagem</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                  {imageUploading && <span className="text-sm text-muted-foreground">Enviando...</span>}
                </div>
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                )}
              </div>

              <div>
                <Label htmlFor="cta_text">Texto do CTA</Label>
                <Input
                  id="cta_text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="cta_url">URL do CTA</Label>
                <Input
                  id="cta_url"
                  value={formData.cta_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta_url: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="version">Versão</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Ativa</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span>{note.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {getSizeLabel(note.size)}
                  </span>
                  {note.is_active ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(note)}
                  >
                    {note.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(note)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-semibold">{note.title}</h3>
                  {note.description && (
                    <p className="text-sm text-muted-foreground mt-1">{note.description}</p>
                  )}
                  {note.cta_text && (
                    <p className="text-sm mt-2">
                      <strong>CTA:</strong> {note.cta_text}
                      {note.cta_url && (
                        <a href={note.cta_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary underline">
                          {note.cta_url}
                        </a>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Versão: {note.version} | Criado em: {new Date(note.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {note.image_url && (
                  <div className="flex justify-center">
                    <img 
                      src={note.image_url} 
                      alt={note.title}
                      className="h-24 w-24 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma release note encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default ReleaseNotesAdmin;