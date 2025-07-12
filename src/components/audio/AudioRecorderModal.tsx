import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Play, Pause, RotateCcw, Check, X } from 'lucide-react';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { parseExpenseService } from '@/services/transactions/parseExpenseService';
import { transactionCategories } from '@/data/categories';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AudioRecorderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionConfirm: (data: {
    description: string;
    amount: number;
    category: string;
    date: string;
    type: 'expense' | 'income';
  }) => void;
}

export const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
  open,
  onOpenChange,
  onTransactionConfirm,
}) => {
  const {
    isRecording,
    isProcessing,
    audioBlob,
    audioUrl,
    transcription,
    duration,
    startRecording,
    stopRecording,
    transcribeAudio,
    resetRecording,
  } = useAudioRecording();

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense' as 'expense' | 'income',
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    if (!audioUrl) return;

    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      setIsPlaying(true);
    }
  };

  const handleTranscribe = async () => {
    await transcribeAudio();
    
    if (transcription) {
      try {
        const parsed = await parseExpenseService.parseExpenseText(transcription);
        setParsedData(parsed);
        
        setFormData({
          description: parsed.description || transcription,
          amount: parsed.amount?.toString() || '',
          category: parsed.category || '',
          date: parsed.date || format(new Date(), 'yyyy-MM-dd'),
          type: (parsed.type as 'expense' | 'income') || 'expense',
        });
      } catch (error) {
        console.error('Error parsing transcription:', error);
        setFormData(prev => ({
          ...prev,
          description: transcription,
        }));
      }
    }
  };

  const handleConfirm = () => {
    if (!formData.description || !formData.amount) {
      toast.error('Preencha a descrição e o valor');
      return;
    }

    onTransactionConfirm({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category || 'other',
      date: formData.date,
      type: formData.type,
    });

    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    resetRecording();
    setParsedData(null);
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
    });
    setIsPlaying(false);
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gravar Transação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recording Section */}
          <div className="flex flex-col items-center space-y-4">
            {!audioBlob ? (
              <div className="text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className="w-16 h-16 rounded-full"
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </Button>
                </div>
                
                {isRecording && (
                  <div className="text-center">
                    <div className="text-2xl font-mono text-destructive">
                      {formatDuration(duration)}
                    </div>
                    <p className="text-sm text-muted-foreground">Gravando...</p>
                  </div>
                )}
                
                {!isRecording && (
                  <p className="text-sm text-muted-foreground">
                    Clique no microfone para começar a gravar
                  </p>
                )}
              </div>
            ) : (
              <div className="w-full space-y-4">
                {/* Audio Player */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePlay}
                      disabled={isProcessing}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <span className="text-sm font-mono">{formatDuration(duration)}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleReset}
                    disabled={isProcessing}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Transcription */}
                {!transcription && !isProcessing && (
                  <Button onClick={handleTranscribe} className="w-full">
                    Transcrever Áudio
                  </Button>
                )}

                {isProcessing && (
                  <div className="text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Transcrevendo áudio...</p>
                  </div>
                )}

                {transcription && (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <Label className="text-xs text-muted-foreground">Transcrição:</Label>
                      <p className="text-sm mt-1">{transcription}</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Descrição da transação"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="amount">Valor</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="0,00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="type">Tipo</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value: 'expense' | 'income') => 
                              setFormData(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="expense">Despesa</SelectItem>
                              <SelectItem value="income">Receita</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="category">Categoria</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {transactionCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="date">Data</Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button onClick={handleConfirm} className="flex-1">
                        <Check className="w-4 h-4 mr-2" />
                        Confirmar
                      </Button>
                      <Button variant="outline" onClick={handleClose} className="flex-1">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};