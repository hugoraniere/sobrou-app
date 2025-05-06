
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ResetAccountDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResetAccountDataDialog: React.FC<ResetAccountDataDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const [confirm, setConfirm] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);

  const handleResetAccountData = async () => {
    if (!confirm) return;

    try {
      setIsResetting(true);
      
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Excluir todas as transações do usuário
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Fechar o diálogo
      onOpenChange(false);
      setConfirm(false);
      
      toast.success(t('settings.dataResetSuccess', 'Dados da conta resetados com sucesso'));
    } catch (error: any) {
      toast.error(error.message || t('settings.dataResetError', 'Erro ao resetar dados da conta'));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('settings.resetAccountData', 'Resetar Dados da Conta')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('settings.resetAccountDataDesc', 'Esta ação excluirá permanentemente todas as suas transações. Esta ação não pode ser desfeita.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex items-center space-x-2 py-4">
          <Switch id="confirm-reset" checked={confirm} onCheckedChange={setConfirm} />
          <Label htmlFor="confirm-reset" className="font-medium text-red-500">
            {t('settings.confirmResetText', 'Confirmo que desejo excluir todas as minhas transações')}
          </Label>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel', 'Cancelar')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleResetAccountData}
            disabled={!confirm || isResetting} 
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isResetting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('common.processing', 'Processando...')}
              </span>
            ) : (
              <span className="flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('settings.resetAccount', 'Resetar Dados')}
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetAccountDataDialog;
