import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { ReleaseNote, ReleaseNotesService } from '@/services/releaseNotesService';
import { toast } from 'sonner';
import ReleaseNoteForm from '@/components/admin/release-notes/ReleaseNoteForm';

const ReleaseNotesAdmin = () => {
  const [notes, setNotes] = useState<ReleaseNote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<ReleaseNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await ReleaseNotesService.getAllReleaseNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading release notes:', error);
      toast.error("Erro ao carregar release notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Partial<ReleaseNote>) => {
    try {
      if (editingNote) {
        const updated = await ReleaseNotesService.updateReleaseNote(editingNote.id, data);
        setNotes(prev => prev.map(note => note.id === editingNote.id ? updated : note));
        toast.success('Release note atualizado com sucesso!');
      } else {
        const created = await ReleaseNotesService.createReleaseNote(data as Omit<ReleaseNote, 'id' | 'created_at' | 'updated_at'>);
        setNotes(prev => [created, ...prev]);
        toast.success('Release note criado com sucesso!');
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error saving release note:', error);
      toast.error('Erro ao salvar release note');
    }
  };

  const handleEdit = (note: ReleaseNote) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta release note?')) return;

    try {
      await ReleaseNotesService.deleteReleaseNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success("Release note excluída com sucesso");
    } catch (error) {
      console.error('Error deleting release note:', error);
      toast.error("Erro ao excluir release note");
    }
  };

  const handleToggleActive = async (note: ReleaseNote) => {
    try {
      // Se estamos ativando esta nota, desativa todas as outras primeiro
      if (!note.is_active) {
        const activeNotes = notes.filter(n => n.is_active && n.id !== note.id);
        for (const activeNote of activeNotes) {
          await ReleaseNotesService.updateReleaseNote(activeNote.id, { is_active: false });
        }
      }
      
      const updated = await ReleaseNotesService.updateReleaseNote(note.id, { 
        is_active: !note.is_active 
      });
      
      setNotes(prev => prev.map(n => 
        n.id === note.id 
          ? updated 
          : (!note.is_active ? { ...n, is_active: false } : n)
      ));
      
      toast.success(`Release note ${!note.is_active ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Error toggling release note status:', error);
      toast.error('Erro ao alterar status do release note');
    }
  };

  const handleCloseForm = () => {
    setEditingNote(null);
    setShowForm(false);
  };

  const getDisplayBehaviorLabel = (behavior: string) => {
    switch (behavior) {
      case 'once': return 'Uma vez';
      case 'every_login': return 'Todo login';
      case 'on_dismiss': return 'Até fechar';
      default: return behavior;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background-base">
        <main className="w-full px-4 md:px-8 py-6 md:py-8">
          <div className="flex justify-center items-center h-64">
            <p>Carregando release notes...</p>
          </div>
        </main>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background-base">
        <main className="w-full px-4 md:px-8 py-6 md:py-8">
          <ReleaseNoteForm
            initialData={editingNote || undefined}
            onSave={handleSave}
            onCancel={handleCloseForm}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background-base">
      <main className="w-full px-4 md:px-8 py-6 md:py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Release Notes</h1>
            <p className="text-gray-600">Gerencie comunicações sobre novas funcionalidades e melhorias</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Release Note
          </Button>
        </div>

        {notes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">Nenhuma release note encontrada.</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Release Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={note.is_active ? "default" : "secondary"}>
                          {note.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Badge variant="outline">{note.size}</Badge>
                        <Badge variant="outline">
                          {getDisplayBehaviorLabel(note.display_behavior)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{note.name}</CardTitle>
                      <h3 className="text-lg font-medium text-muted-foreground">{note.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={note.is_active ? "destructive" : "default"}
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
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(note.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                      {note.description && (
                        <p className="text-sm text-muted-foreground">{note.description}</p>
                      )}
                      
                      {note.cta_text && note.cta_url && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Call-to-Action:</p>
                          <p className="text-sm">
                            <strong>{note.cta_text}</strong>
                            <a 
                              href={note.cta_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="ml-2 text-primary underline"
                            >
                              {note.cta_url}
                            </a>
                          </p>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Versão: {note.version}</p>
                        <p>Criado em: {new Date(note.created_at).toLocaleDateString('pt-BR')}</p>
                        <p>Atualizado em: {new Date(note.updated_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    
                    {note.image_url && (
                      <div className="flex justify-center md:justify-end">
                        <img 
                          src={note.image_url} 
                          alt={note.title}
                          className="h-32 w-32 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReleaseNotesAdmin;