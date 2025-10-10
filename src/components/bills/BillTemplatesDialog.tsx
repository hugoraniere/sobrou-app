import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BillTemplate } from '@/types/bills';
import { formatCurrency } from '@/lib/utils';
import { FileText, Repeat } from 'lucide-react';

interface BillTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: BillTemplate) => void;
}

const frequencyLabels = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
};

export const BillTemplatesDialog: React.FC<BillTemplatesDialogProps> = ({
  open,
  onOpenChange,
  onSelectTemplate,
}) => {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['bill-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bill_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as BillTemplate[];
    },
    enabled: open,
  });

  const handleSelectTemplate = (template: BillTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Usar Template de Conta</DialogTitle>
          <DialogDescription>
            Selecione um template pré-configurado para criar sua conta rapidamente
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary hover:shadow-sm transition-all"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Repeat className="h-3 w-3 mr-1" />
                      {frequencyLabels[template.recurrence_frequency]}
                    </Badge>
                  </div>

                  {template.description && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Valor sugerido</div>
                      <div className="font-semibold text-sm">
                        {template.default_amount > 0
                          ? formatCurrency(template.default_amount)
                          : 'A definir'}
                      </div>
                    </div>
                    {template.category && (
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    Usar Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum template disponível no momento
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
