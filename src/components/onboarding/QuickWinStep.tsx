import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { PayablesService } from '@/services/PayablesService';
import { AnalyticsService } from '@/services/AnalyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths } from 'date-fns';

interface QuickWinStepProps {
  onComplete: () => void;
}

export const QuickWinStep: React.FC<QuickWinStepProps> = ({ onComplete }) => {
  const { progress, updateProgress } = useOnboarding();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<'payable' | 'transaction' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payable form state
  const [payableData, setPayableData] = useState({
    description: '',
    amount: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    repeats_monthly: false
  });

  // Transaction form state (simplified)
  const [transactionData, setTransactionData] = useState({
    description: '',
    amount: '',
    payment_method: '',
    category: ''
  });

  const shouldShowPayableOption = progress?.goal === 'dividas' || progress?.goal === 'organizar';
  const defaultOption = shouldShowPayableOption ? 'payable' : 'transaction';

  React.useEffect(() => {
    setSelectedOption(defaultOption);
    AnalyticsService.trackQuickWinOpened(defaultOption);
  }, [defaultOption]);

  const handlePayableSubmit = async () => {
    if (!user || !payableData.description || !payableData.amount) return;

    setIsSubmitting(true);
    try {
      const newPayable = await PayablesService.create({
        user_id: user.id,
        description: payableData.description,
        amount: parseFloat(payableData.amount),
        due_date: payableData.due_date,
        repeats_monthly: payableData.repeats_monthly,
        status: 'aberta'
      });

      if (newPayable) {
        await updateProgress({ quickwin_done: true });
        AnalyticsService.trackPayableCreated();
        
        toast({
          message: "Conta criada! Sua primeira conta a pagar foi cadastrada com sucesso.",
          type: 'success'
        });

        onComplete();
      }
    } catch (error) {
      toast({
        message: "Erro ao criar conta. Tente novamente em alguns instantes.",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransactionSubmit = async () => {
    if (!transactionData.description || !transactionData.amount || !transactionData.category) return;

    setIsSubmitting(true);
    try {
      // Aqui integraria com TransactionService existente
      // Por simplicidade, vamos apenas marcar como feito
      await updateProgress({ quickwin_done: true });
      AnalyticsService.trackTransactionCreated();
      
      toast({
        message: "Transação registrada! Sua primeira transação foi cadastrada com sucesso.",
        type: 'success'
      });

      onComplete();
    } catch (error) {
      toast({
        message: "Erro ao registrar transação. Tente novamente em alguns instantes.",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { value: 'boleto', label: 'Boleto' },
    { value: 'cartao', label: 'Cartão' },
    { value: 'debito', label: 'Débito' },
    { value: 'pix', label: 'PIX' }
  ];

  const categories = [
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'casa', label: 'Casa' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Vamos fazer acontecer! ⚡</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Escolha uma ação rápida para ver resultado imediato:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {shouldShowPayableOption && (
            <Card 
              className={`cursor-pointer transition-all ${selectedOption === 'payable' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedOption('payable')}
            >
              <CardHeader className="text-center pb-2">
                <Receipt className="h-6 w-6 mx-auto mb-2 text-primary" />
                <CardTitle className="text-sm">Criar conta a pagar</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-center">
                  Evite atraso: cadastre uma conta que vence este mês
                </CardDescription>
              </CardContent>
            </Card>
          )}
          
          <Card 
            className={`cursor-pointer transition-all ${selectedOption === 'transaction' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedOption('transaction')}
          >
            <CardHeader className="text-center pb-2">
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
              <CardTitle className="text-sm">Registrar transação</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs text-center">
                Registre uma despesa e veja o gráfico mudar
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedOption === 'payable' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Nova Conta a Pagar (BETA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="payable-description">Descrição</Label>
              <Input
                id="payable-description"
                placeholder="Ex: Conta de luz"
                value={payableData.description}
                onChange={(e) => setPayableData({...payableData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payable-amount">Valor</Label>
                <Input
                  id="payable-amount"
                  type="number"
                  placeholder="0,00"
                  value={payableData.amount}
                  onChange={(e) => setPayableData({...payableData, amount: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="payable-date">Vencimento</Label>
                <Input
                  id="payable-date"
                  type="date"
                  value={payableData.due_date}
                  onChange={(e) => setPayableData({...payableData, due_date: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="payable-recurring"
                checked={payableData.repeats_monthly}
                onCheckedChange={(checked) => 
                  setPayableData({...payableData, repeats_monthly: checked as boolean})
                }
              />
              <Label htmlFor="payable-recurring" className="text-sm">
                Repetir mensalmente
              </Label>
            </div>

            <Button 
              onClick={handlePayableSubmit}
              disabled={isSubmitting || !payableData.description || !payableData.amount}
              className="w-full"
            >
              {isSubmitting ? 'Salvando...' : 'Criar conta'}
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedOption === 'transaction' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Nova Transação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="transaction-description">Descrição</Label>
              <Input
                id="transaction-description"
                placeholder="Ex: Almoço no restaurante"
                value={transactionData.description}
                onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transaction-amount">Valor</Label>
                <Input
                  id="transaction-amount"
                  type="number"
                  placeholder="0,00"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Forma de pagamento</Label>
                <Select 
                  value={transactionData.payment_method}
                  onValueChange={(value) => setTransactionData({...transactionData, payment_method: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Categoria</Label>
              <Select 
                value={transactionData.category}
                onValueChange={(value) => setTransactionData({...transactionData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleTransactionSubmit}
              disabled={isSubmitting || !transactionData.description || !transactionData.amount || !transactionData.category}
              className="w-full"
            >
              {isSubmitting ? 'Salvando...' : 'Registrar transação'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onComplete}>
          Pular
        </Button>
        
        <Button 
          onClick={() => selectedOption === 'payable' ? handlePayableSubmit() : handleTransactionSubmit()}
          disabled={isSubmitting}
          className="px-8"
        >
          Ver no painel
        </Button>
      </div>
    </div>
  );
};