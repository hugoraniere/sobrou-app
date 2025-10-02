import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ReleaseNotesService, ReleaseNote } from '@/services/releaseNotesService';
import { AnalyticsService } from '@/services/AnalyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ReleaseNotesModal: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeNote, setActiveNote] = useState<ReleaseNote | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show in app routes, never in landing, admin, or public pages
  const appRoutes = ['/dashboard', '/transactions', '/goals', '/bills-to-pay', '/settings', '/whatsapp-integration', '/financial-planning', '/restaurant-calculator', '/monthly-summary'];
  const isAppRoute = appRoutes.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    console.log('[ReleaseNotesModal] Auth:', isAuthenticated, 'Route:', location.pathname, 'IsAppRoute:', isAppRoute);
    if (isAuthenticated && isAppRoute) {
      loadActiveNote();
    }
  }, [isAuthenticated, isAppRoute, location.pathname]);

  const loadActiveNote = async () => {
    try {
      const note = await ReleaseNotesService.getUndismissedActiveReleaseNote();
      if (note) {
        setActiveNote(note);
        setIsOpen(true);
        // Track release note shown
        await AnalyticsService.trackReleaseNoteShown(note.id, note.version, 'modal');
      }
    } catch (error) {
      console.error('Error loading active release note:', error);
    }
  };

  const handleDismiss = async (dismissType: 'cta' | 'secondary' | 'overlay' = 'overlay') => {
    if (!activeNote) return;

    try {
      await ReleaseNotesService.dismissReleaseNote(activeNote.id);
      await AnalyticsService.trackReleaseNoteDismissed(activeNote.id, dismissType, activeNote.version);
      setIsOpen(false);
      setActiveNote(null);
    } catch (error) {
      console.error('Error dismissing release note:', error);
      toast.error("Erro ao fechar release note");
    }
  };

  const handleCTAClick = async () => {
    if (!activeNote) return;
    
    if (activeNote.cta_text) {
      if (activeNote.cta_action === 'close') {
        // CTA button action is close
        await AnalyticsService.trackReleaseNoteCTAClicked(
          activeNote.id, 
          activeNote.cta_text, 
          null, 
          activeNote.version
        );
        await handleDismiss('cta');
      } else if (activeNote.cta_url) {
        // CTA button action is link (default)
        await AnalyticsService.trackReleaseNoteCTAClicked(
          activeNote.id, 
          activeNote.cta_text, 
          activeNote.cta_url, 
          activeNote.version
        );
        window.open(activeNote.cta_url, '_blank');
        await handleDismiss('cta');
      }
    }
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
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleDismiss('overlay'); }}>
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
              onClick={async () => {
                const actionType = activeNote.secondary_button_action === 'custom_link' ? 'custom_link' : 'close';
                await AnalyticsService.trackReleaseNoteSecondaryButtonClicked(
                  activeNote.id, 
                  actionType, 
                  activeNote.secondary_button_url || null, 
                  activeNote.version
                );
                if (actionType === 'custom_link' && activeNote.secondary_button_url) {
                  window.open(activeNote.secondary_button_url, '_blank');
                }
                await handleDismiss('secondary');
              }}
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