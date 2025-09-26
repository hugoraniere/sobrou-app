import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ReleaseNotesService, ReleaseNote } from '@/services/releaseNotesService';
import { toast } from 'sonner';

const ReleaseNotesModal: React.FC = () => {
  const [activeNote, setActiveNote] = useState<ReleaseNote | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  

  useEffect(() => {
    loadActiveNote();
  }, []);

  const loadActiveNote = async () => {
    try {
      const note = await ReleaseNotesService.getUndismissedActiveReleaseNote();
      if (note) {
        setActiveNote(note);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error loading active release note:', error);
    }
  };

  const handleDismiss = async () => {
    if (!activeNote) return;

    try {
      await ReleaseNotesService.dismissReleaseNote(activeNote.id);
      setIsOpen(false);
      setActiveNote(null);
    } catch (error) {
      console.error('Error dismissing release note:', error);
      toast.error("Erro ao fechar release note");
    }
  };

  const handleCTAClick = () => {
    if (activeNote?.cta_url) {
      window.open(activeNote.cta_url, '_blank');
    }
    handleDismiss();
  };

  if (!activeNote) return null;

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'max-w-md';
      case 'large':
        return 'max-w-4xl';
      default: // medium
        return 'max-w-2xl';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className={`${getSizeClasses(activeNote.size)} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {activeNote.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {activeNote.image_url && (
            <div className={`flex ${
              activeNote.image_position === 'left' ? 'justify-start' :
              activeNote.image_position === 'right' ? 'justify-end' :
              'justify-center'
            }`}>
              <img
                src={activeNote.image_url}
                alt={activeNote.title}
                className={`rounded-lg object-cover ${
                  activeNote.size === 'small' 
                    ? 'h-32 w-32' 
                    : activeNote.size === 'large'
                    ? 'h-64 w-full'
                    : 'h-48 w-full'
                }`}
              />
            </div>
          )}
          
          {activeNote.description && (
            <div className={`${
              activeNote.image_position === 'left' ? 'text-left' :
              activeNote.image_position === 'right' ? 'text-right' :
              'text-center'
            }`}>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {activeNote.description}
              </p>
            </div>
          )}
          
          <div className="flex justify-center gap-3">
            {activeNote.cta_text && activeNote.cta_url && (
              <Button onClick={handleCTAClick}>
                {activeNote.cta_text}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={activeNote.secondary_button_action === 'custom_link' ? () => {
                if (activeNote.secondary_button_url) {
                  window.open(activeNote.secondary_button_url, '_blank');
                }
                handleDismiss();
              } : handleDismiss}
            >
              {activeNote.secondary_button_text || 'Fechar'}
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Versão {activeNote.version}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReleaseNotesModal;