import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReleaseNote } from '@/services/releaseNotesService';

interface ReleaseNotePreviewProps {
  note: Partial<ReleaseNote> | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReleaseNotePreview: React.FC<ReleaseNotePreviewProps> = ({ note, isOpen, onClose }) => {
  if (!note) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${getSizeClasses(note.size || 'medium')} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {note.title || 'Título do Release Note'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {note.image_url && (
            <div className="flex justify-center">
              <img
                src={note.image_url}
                alt={note.title || 'Preview image'}
                className={`rounded-lg object-cover ${
                  note.size === 'small' 
                    ? 'h-32 w-32' 
                    : note.size === 'large'
                    ? 'h-64 w-full'
                    : 'h-48 w-full'
                }`}
              />
            </div>
          )}
          
          {note.description && (
            <div className="text-center">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {note.description}
              </p>
            </div>
          )}
          
          <div className="flex justify-center gap-3">
            {note.cta_text && note.cta_url && (
              <Button>
                {note.cta_text}
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Versão {note.version || '1.0'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReleaseNotePreview;