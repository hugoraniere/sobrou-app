import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { ReleaseNote, ReleaseNotesService } from '@/services/releaseNotesService';
import { toast } from 'sonner';
import ReleaseNoteForm from '@/components/admin/release-notes/ReleaseNoteForm';

const ReleaseNotesManager: React.FC = () => {
  const [notes, setNotes] = useState<ReleaseNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<ReleaseNote | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const allNotes = await ReleaseNotesService.getAllReleaseNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error('Error loading release notes:', error);
      toast.error('Erro ao carregar release notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (noteData: Partial<ReleaseNote>) => {
    try {
      if (editingNote) {
        await ReleaseNotesService.updateReleaseNote(editingNote.id, noteData);
        toast.success('Release note atualizada com sucesso!');
      } else {
        await ReleaseNotesService.createReleaseNote(noteData as Omit<ReleaseNote, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Release note criada com sucesso!');
      }
      
      setShowForm(false);
      setEditingNote(null);
      loadNotes();
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
      toast.success('Release note excluída com sucesso!');
      loadNotes();
    } catch (error) {
      console.error('Error deleting release note:', error);
      toast.error('Erro ao excluir release note');
    }
  };

  const handleToggleActive = async (note: ReleaseNote) => {
    try {
      const updatedNote = { ...note, is_active: !note.is_active };
      await ReleaseNotesService.updateReleaseNote(note.id, updatedNote);
      toast.success(`Release note ${updatedNote.is_active ? 'ativada' : 'desativada'} com sucesso!`);
      loadNotes();
    } catch (error) {
      console.error('Error toggling release note:', error);
      toast.error('Erro ao alterar status da release note');
    }
  };

  const getDisplayBehaviorLabel = (behavior: string) => {
    switch (behavior) {
      case 'once': return 'Uma vez';
      case 'every_login': return 'Todo login';
      case 'on_dismiss': return 'Até fechar';
      default: return behavior;
    }
  };

  if (showForm) {
    return (
      <ReleaseNoteForm
        initialData={editingNote || {}}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingNote(null);
        }}
      />
    );
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Release Notes</h2>
          <p className="text-muted-foreground">
            Gerencie notas de versão e novidades para manter usuários informados
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Release Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Nenhuma release note criada</h3>
            <p className="text-muted-foreground mb-4">
              Crie sua primeira release note para informar usuários sobre novidades
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira release note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {note.title}
                      {note.is_active && <Badge variant="default">Ativo</Badge>}
                      <Badge variant="outline">v{note.version}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {note.name} • {getDisplayBehaviorLabel(note.display_behavior)} • {note.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(note)}
                    >
                      {note.is_active ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(note)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {note.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{note.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReleaseNotesManager;