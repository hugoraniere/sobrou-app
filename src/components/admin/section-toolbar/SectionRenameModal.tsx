import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSectionManagement } from '@/contexts/SectionManagementContext';
import type { LandingSection } from '@/contexts/SectionManagementContext';
import { toast } from 'sonner';

interface SectionRenameModalProps {
  section: LandingSection | null;
  isOpen: boolean;
  onClose: () => void;
}

const SectionRenameModal: React.FC<SectionRenameModalProps> = ({
  section,
  isOpen,
  onClose,
}) => {
  const { updateSectionName, loading } = useSectionManagement();
  const [name, setName] = useState('');

  useEffect(() => {
    if (section) {
      setName(section.displayName);
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!section || !name.trim()) return;

    try {
      await updateSectionName(section.id, name.trim());
      toast("Nome da seção atualizado com sucesso!");
      onClose();
    } catch (error) {
      toast("Erro ao atualizar nome da seção");
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Renomear Seção</DialogTitle>
            <DialogDescription>
              Altere o nome de exibição desta seção. Isso não afetará a funcionalidade.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="sectionName">Nome da Seção</Label>
              <Input
                id="sectionName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o novo nome"
                maxLength={50}
                required
              />
              <p className="text-xs text-muted-foreground">
                Componente: {section?.component}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionRenameModal;