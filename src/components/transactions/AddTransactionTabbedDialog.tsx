import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionForm from './components/TransactionForm';
import AIPromptInput from '@/components/AIPromptInput';

interface AddTransactionTabbedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded?: () => void;
}

const AddTransactionTabbedDialog: React.FC<AddTransactionTabbedDialogProps> = ({
  open,
  onOpenChange,
  onTransactionAdded
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ai');

  const handleTransactionSuccess = () => {
    onOpenChange(false);
    if (onTransactionAdded) {
      onTransactionAdded();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {t('transactions.add', 'Nova Transação')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('transactions.addDescription', 'Adicione uma nova transação usando IA ou preenchimento manual')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai">Com IA</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai" className="space-y-4 mt-6">
            <AIPromptInput onTransactionAdded={handleTransactionSuccess} />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 mt-6">
            <TransactionForm onSuccess={handleTransactionSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionTabbedDialog;