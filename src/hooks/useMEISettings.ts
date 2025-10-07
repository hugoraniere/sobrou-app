import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MEISettingsService } from '@/services/meiSettingsService';
import { toast } from 'sonner';
import type { MEISettings } from '@/types/mei';

export function useMEISettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['mei-settings'],
    queryFn: () => MEISettingsService.getOrCreateSettings(),
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Omit<MEISettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => 
      MEISettingsService.updateSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mei-settings'] });
      toast.success('Configurações MEI atualizadas');
    },
    onError: (error) => {
      console.error('Error updating MEI settings:', error);
      toast.error('Erro ao atualizar configurações MEI');
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
