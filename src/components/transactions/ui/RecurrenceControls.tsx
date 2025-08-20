
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  transactionDate?: Date;
  repeatForever?: boolean;
  onIsRecurringChange: (value: boolean) => void;
  onFrequencyChange: (value: string) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onInstallmentTotalChange: (total: number | undefined) => void;
  onRepeatForeverChange?: (value: boolean) => void;
}

const RecurrenceControls: React.FC<RecurrenceControlsProps> = ({
  isRecurring,
  frequency,
  endDate,
  installmentTotal,
  transactionDate,
  repeatForever = false,
  onIsRecurringChange,
  onFrequencyChange,
  onEndDateChange,
  onInstallmentTotalChange,
  onRepeatForeverChange,
}) => {
  const { t } = useTranslation();

  // Calculate installments based on date range and frequency
  const calculateInstallments = (startDate: Date, endDate: Date, freq: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    
    while (start <= end) {
      count++;
      switch (freq) {
        case 'daily':
          start.setDate(start.getDate() + 1);
          break;
        case 'weekly':
          start.setDate(start.getDate() + 7);
          break;
        case 'monthly':
          start.setMonth(start.getMonth() + 1);
          break;
        case 'yearly':
          start.setFullYear(start.getFullYear() + 1);
          break;
      }
    }
    return Math.max(1, count);
  };

  // Calculate end date based on installments and frequency
  const calculateEndDate = (startDate: Date, total: number, freq: string): Date => {
    const result = new Date(startDate);
    const installmentsToAdd = Math.max(0, total - 1);
    
    switch (freq) {
      case 'daily':
        result.setDate(result.getDate() + installmentsToAdd);
        break;
      case 'weekly':
        result.setDate(result.getDate() + (installmentsToAdd * 7));
        break;
      case 'monthly':
        result.setMonth(result.getMonth() + installmentsToAdd);
        break;
      case 'yearly':
        result.setFullYear(result.getFullYear() + installmentsToAdd);
        break;
    }
    return result;
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onEndDateChange(date);
    if (date && transactionDate && !repeatForever) {
      const calculatedTotal = calculateInstallments(transactionDate, date, frequency);
      onInstallmentTotalChange(calculatedTotal);
    }
  };

  const handleInstallmentTotalChange = (total: number | undefined) => {
    onInstallmentTotalChange(total);
    if (total && transactionDate && !repeatForever) {
      const calculatedEndDate = calculateEndDate(transactionDate, total, frequency);
      onEndDateChange(calculatedEndDate);
    }
  };

  const handleRepeatForeverChange = (checked: boolean) => {
    onRepeatForeverChange?.(checked);
    if (checked) {
      onEndDateChange(undefined);
      onInstallmentTotalChange(undefined);
    }
  };

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

          <div className="space-y-4">
            {/* Horizontal layout for date and repetitions */}
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Repetir até */}
              <div className="flex-1 space-y-2">
                <Label>{t('transactions.repeatUntil', 'Repetir até')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={repeatForever}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                        repeatForever && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : t('transactions.selectEndDate', 'Selecionar data final')}
                    </Button>
                  </PopoverTrigger>
                  {!repeatForever && (
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={handleEndDateChange}
                        disabled={(date) => !transactionDate || date < transactionDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  )}
                </Popover>
              </div>

              {/* "ou" separator */}
              <div className="flex items-center justify-center pb-2">
                <span className="text-sm text-muted-foreground">{t('transactions.or', 'ou')}</span>
              </div>

              {/* Repetir por */}
              <div className="flex-1 space-y-2">
                <Label>{t('transactions.repeatFor', 'Repetir por')}</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    max="999"
                    disabled={repeatForever}
                    placeholder={t('transactions.repetitionsPlaceholder', 'Ex: 12')}
                    value={installmentTotal || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInstallmentTotalChange(value ? parseInt(value) : undefined);
                    }}
                    className={cn(
                      "pr-12",
                      repeatForever && "opacity-50 cursor-not-allowed"
                    )}
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                    {t('transactions.times', 'vezes')}
                  </span>
                </div>
              </div>
            </div>

            {/* Repetir para sempre checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="repeat-forever"
                checked={repeatForever}
                onCheckedChange={handleRepeatForeverChange}
              />
              <Label htmlFor="repeat-forever">
                {t('transactions.repeatForever', 'Repetir para sempre')}
              </Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurrenceControls;
