import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

interface ReleaseNote {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  media_url?: string;
  media_type: 'image' | 'video';
  cta_text?: string;
  cta_url?: string;
}

interface ReleaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: ReleaseNote[];
  autoPlay?: boolean;
  transitionTime?: number;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  autoPlay = false,
  transitionTime = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || notes.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notes.length);
    }, transitionTime);

    return () => clearInterval(timer);
  }, [isAutoPlaying, notes.length, transitionTime]);

  // Reset on modal open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsAutoPlaying(autoPlay);
    }
  }, [isOpen, autoPlay]);

  if (!notes.length) return null;

  const currentNote = notes[currentIndex];
  const hasMultipleNotes = notes.length > 1;

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % notes.length);
  };

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + notes.length) % notes.length);
  };

  const handleCtaClick = () => {
    if (currentNote.cta_url) {
      window.open(currentNote.cta_url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <DialogTitle className="text-xl">Novidades</DialogTitle>
                {hasMultipleNotes && (
                  <Badge variant="secondary" className="text-xs">
                    {currentIndex + 1} de {notes.length}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0 space-y-4">
                {/* Media */}
                {currentNote.media_url && (
                  <div className="relative rounded-lg overflow-hidden bg-muted">
                    {currentNote.media_type === 'image' ? (
                      <img
                        src={currentNote.media_url}
                        alt={currentNote.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <video
                        src={currentNote.media_url}
                        className="w-full h-48 object-cover"
                        controls
                        muted
                        autoPlay={isAutoPlaying}
                      />
                    )}
                  </div>
                )}

                {/* Text Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {currentNote.title}
                    </h3>
                    {currentNote.subtitle && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentNote.subtitle}
                      </p>
                    )}
                  </div>
                  
                  <p className="text-sm text-foreground leading-relaxed">
                    {currentNote.description}
                  </p>
                </div>

                {/* CTA Button */}
                {currentNote.cta_text && (
                  <Button 
                    onClick={handleCtaClick}
                    className="w-full"
                    size="sm"
                  >
                    {currentNote.cta_text}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          {hasMultipleNotes && (
            <div className="flex items-center justify-between p-6 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>

              {/* Indicators */}
              <div className="flex gap-1">
                {notes.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(index);
                    }}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === notes.length - 1}
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Auto-play indicator */}
          {isAutoPlaying && hasMultipleNotes && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs animate-pulse">
                Auto
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};