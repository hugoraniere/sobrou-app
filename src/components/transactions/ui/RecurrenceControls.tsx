
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface RecurrenceControlsProps {
  isRecurring: boolean;
  frequency: string;
  endDate?: Date;
  installmentTotal?: number;
  onIsRecurringChange: (value: boolean) => void;
  onFrequencyChange: (value: string) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onInstallmentTotalChange: (total: number | undefined) => void;
}

const RecurrenceControls: React.FC<RecurrenceControlsProps> = ({
  isRecurring,
  frequency,
  endDate,
  installmentTotal,
  onIsRecurringChange,
  onFrequencyChange,
  onEndDateChange,
  onInstallmentTotalChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="is-recurring"
          checked={isRecurring}
          onCheckedChange={onIsRecurringChange}
        />
        <Label htmlFor="is-recurring">
          {t('transactions.recurring', 'Transação Recorrente')}
        </Label>
      </div>

      {isRecurring && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('transactions.frequency', 'Frequência')}</Label>
            <Select value={frequency} onValueChange={onFrequencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t('common.daily', 'Diária')}</SelectItem>
                <SelectItem value="weekly">{t('common.weekly', 'Semanal')}</SelectItem>
                <SelectItem value="monthly">{t('common.monthly', 'Mensal')}</SelectItem>
                <SelectItem value="yearly">{t('common.yearly', 'Anual')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('transactions.endDate', 'Data Final (Opcional)')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : t('transactions.selectEndDate', 'Selecionar data final')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>{t('transactions.installmentTotal', 'Total de Parcelas (Opcional)')}</Label>
            <Input
              type="number"
              min="1"
              max="99"
              placeholder={t('transactions.installmentPlaceholder', 'Ex: 12')}
              value={installmentTotal || ''}
              onChange={(e) => {
                const value = e.target.value;
                onInstallmentTotalChange(value ? parseInt(value) : undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurrenceControls;
