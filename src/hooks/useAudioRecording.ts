import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AudioRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  transcription: string | null;
  duration: number;
}

export const useAudioRecording = () => {
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    isProcessing: false,
    audioBlob: null,
    audioUrl: null,
    transcription: null,
    duration: 0,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setState(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false,
        }));

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      setState(prev => ({ ...prev, isRecording: true, duration: 0 }));

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
        }));
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Erro ao acessar o microfone. Verifique as permissões.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, [state.isRecording]);

  const transcribeAudio = useCallback(async () => {
    if (!state.audioBlob) {
      toast.error('Nenhum áudio para transcrever');
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(state.audioBlob);
      
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });

        if (error) {
          console.error('Transcription error:', error);
          toast.error('Erro na transcrição do áudio');
          return;
        }

        setState(prev => ({
          ...prev,
          transcription: data.text,
          isProcessing: false,
        }));

        toast.success('Áudio transcrito com sucesso!');
      };

      reader.onerror = () => {
        setState(prev => ({ ...prev, isProcessing: false }));
        toast.error('Erro ao processar o áudio');
      };

    } catch (error) {
      console.error('Error transcribing audio:', error);
      setState(prev => ({ ...prev, isProcessing: false }));
      toast.error('Erro na transcrição do áudio');
    }
  }, [state.audioBlob]);

  const resetRecording = useCallback(() => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    setState({
      isRecording: false,
      isProcessing: false,
      audioBlob: null,
      audioUrl: null,
      transcription: null,
      duration: 0,
    });
  }, [state.audioUrl]);

  return {
    ...state,
    startRecording,
    stopRecording,
    transcribeAudio,
    resetRecording,
  };
};