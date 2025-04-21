
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DangerZoneSection = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDeleteAccount = () => {
    toast.success(t('settings.accountDeleted', 'Conta excluída com sucesso'));
    setIsDeleteDialogOpen(false);
    logout();
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center text-red-500">
          <Trash2 className="h-5 w-5 mr-2" />
          {t('settings.dangerZone', 'Zona de Perigo')}
        </CardTitle>
        <CardDescription>
          {t('settings.dangerZoneDescription', 'Ações irreversíveis para sua conta')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t('settings.deleteAccount', 'Excluir minha conta permanentemente')}
          </Button>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('settings.confirmDeletion', 'Confirmar exclusão')}</DialogTitle>
              <DialogDescription>
                {t('settings.deleteWarning', 'Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente.')}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 mt-4">
              <Switch id="confirm-delete" checked={confirmDelete} onCheckedChange={setConfirmDelete} />
              <Label htmlFor="confirm-delete" className="font-medium text-red-500">
                {t('settings.confirmDeletionText', 'Confirmo que desejo excluir minha conta permanentemente')}
              </Label>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                {t('common.cancel', 'Cancelar')}
              </Button>
              <Button variant="destructive" disabled={!confirmDelete} onClick={handleDeleteAccount}>
                {t('settings.deleteAccount', 'Excluir minha conta permanentemente')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DangerZoneSection;
