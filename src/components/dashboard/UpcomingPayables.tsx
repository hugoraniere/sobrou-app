import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertCircle } from 'lucide-react';
import { PayablesService } from '@/services/PayablesService';
import { Payable } from '@/types/onboarding';
import { useAuth } from '@/contexts/AuthContext';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const UpcomingPayables: React.FC = () => {
  const { user } = useAuth();
  const [payables, setPayables] = useState<Payable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPayables = async () => {
      if (!user) return;
      
      try {
        const upcoming = await PayablesService.getUpcoming(user.id, 3);
        setPayables(upcoming);
      } catch (error) {
        console.error('Error loading upcoming payables:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayables();
  }, [user]);

  if (isLoading || payables.length === 0) return null;

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    return format(date, "d 'de' MMM", { locale: ptBR });
  };

  const getUrgencyColor = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const daysDiff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 0) return 'destructive';
    if (daysDiff <= 3) return 'warning';
    return 'secondary';
  };

  return (
    <Card data-tour="upcoming-payables">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">
            Próximos Vencimentos
          </CardTitle>
          <Badge variant="secondary" className="text-xs">BETA</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {payables.map((payable) => (
          <div key={payable.id} className="flex items-center justify-between p-2 rounded border">
            <div className="flex-1">
              <p className="text-sm font-medium">{payable.description}</p>
              <p className="text-xs text-muted-foreground">
                R$ {payable.amount.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getUrgencyColor(payable.due_date)} className="text-xs">
                {formatDueDate(payable.due_date)}
              </Badge>
              {new Date(payable.due_date) <= addDays(new Date(), 1) && (
                <AlertCircle className="h-3 w-3 text-orange-500" />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};