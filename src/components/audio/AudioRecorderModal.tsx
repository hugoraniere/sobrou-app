import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, Pause, RotateCcw } from 'lucide-react';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { useMultipleTransactionsParsing } from '@/hooks/useMultipleTransactionsParsing';
import { MultipleTransactionsReview } from './MultipleTransactionsReview';
import { ParsedExpense } from '@/services/transactions/types';

interface AudioRecorderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionConfirm: (data: ParsedExpense | ParsedExpense[]) => void;
}

export const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
  open,
  onOpenChange,
  onTransactionConfirm
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [currentStep, setCurrentStep] = useState<'recording' | 'review'>('recording');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    isRecording,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecording();

  const {
    isProcessing,
    transactions,
    error: processingError,
    processTranscription,
    updateTransaction,
    removeTransaction,
    confirmAllTransactions,
    reset: resetProcessing,
    hasTransactions
  } = useMultipleTransactionsParsing({
    onTransactionsConfirm: (transactions: ParsedExpense[]) => {
      onTransactionConfirm(transactions);
      handleClose();
    }
  });

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = async () => {
    if (!audioBlob) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const handleStopRecording = async () => {
    stopRecording();
    if (!audioBlob) return;

    // Auto-process after recording stops
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64 = btoa(String.fromCharCode(...uint8Array));

      // Call transcription service
      const response = await fetch('https://jevsazpwfowhmjupuuzw.supabase.co/functions/v1/transcribe-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldnNhenB3Zm93aG1qdXB1dXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Njg5MjcsImV4cCI6MjA1OTM0NDkyN30.ZvIahA6EAPrVKSEUoRXDFJn6LeyqF-7_QM-Qv5O8Pn8'
        },
        body: JSON.stringify({ audio: base64 })
      });

      if (!response.ok) {
        throw new Error('Falha na transcrição');
      }

      const result = await response.json();
      const text = result.text;
      setTranscriptionText(text);

      // Process transcription for multiple transactions
      await processTranscription(text);
      setCurrentStep('review');

    } catch (error) {
      console.error('Processing error:', error);
    }
  };

  const handleReset = () => {
    resetRecording();
    resetProcessing();
    setTranscriptionText('');
    setCurrentStep('recording');
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleBackToRecording = () => {
    setCurrentStep('recording');
    resetProcessing();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'recording' ? 'Gravar Transações' : 'Revisar Transações'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep === 'recording' && (
            <>
              {/* Recording Section */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {!audioBlob ? (
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      onClick={isRecording ? handleStopRecording : startRecording}
                      className="rounded-full w-20 h-20"
                      disabled={isProcessing}
                    >
                      {isRecording ? (
                        <MicOff className="h-8 w-8" />
                      ) : (
                        <Mic className="h-8 w-8" />
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={handlePlay}
                        className="rounded-full w-16 h-16"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {isRecording && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Gravando...</p>
                    <p className="text-lg font-mono">{formatDuration(duration)}</p>
                  </div>
                )}

                {isProcessing && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Processando transcrição...</p>
                  </div>
                )}

                {!isRecording && !audioBlob && !isProcessing && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Toque para gravar suas transações
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Fale sobre várias transações em uma gravação
                    </p>
                  </div>
                )}

                {audioBlob && !isProcessing && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Gravação concluída ({formatDuration(duration)})
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Gravar Novamente
                    </Button>
                  </div>
                )}

                {processingError && (
                  <p className="text-sm text-destructive">
                    {processingError}
                  </p>
                )}
              </div>

              {/* Action Buttons for Recording Step */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </>
          )}

          {currentStep === 'review' && hasTransactions && (
            <MultipleTransactionsReview
              transactions={transactions}
              onUpdateTransaction={updateTransaction}
              onRemoveTransaction={removeTransaction}
              onConfirmAll={confirmAllTransactions}
              onBack={handleBackToRecording}
              transcriptionText={transcriptionText}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};