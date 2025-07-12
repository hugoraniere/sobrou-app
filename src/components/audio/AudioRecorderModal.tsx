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
              <div className="text-center space-y-6">
                {!isRecording && !audioBlob && !isProcessing && (
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Clique no botão abaixo para gravar suas transações
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fale sobre várias transações em uma gravação
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        onClick={startRecording}
                        disabled={isProcessing}
                        className="px-8 py-3"
                      >
                        <Mic className="h-5 w-5 mr-2" />
                        Gravar
                      </Button>
                    </div>
                  </div>
                )}

                {isRecording && (
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">Gravando...</p>
                      <p className="text-2xl font-mono font-semibold text-primary">
                        {formatDuration(duration)}
                      </p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="destructive"
                        onClick={handleStopRecording}
                        disabled={isProcessing}
                        className="px-6"
                      >
                        <MicOff className="h-5 w-5 mr-2" />
                        Parar {formatDuration(duration)}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={isProcessing}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {audioBlob && !isProcessing && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Gravação concluída ({formatDuration(duration)})
                      </p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={handlePlay}
                        className="px-6"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Reproduzir
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReset}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Gravar Novamente
                      </Button>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Processando transcrição...</p>
                    <div className="animate-pulse">
                      <div className="h-2 bg-muted rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                )}

                {processingError && (
                  <div className="text-center">
                    <p className="text-sm text-destructive">
                      {processingError}
                    </p>
                  </div>
                )}
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