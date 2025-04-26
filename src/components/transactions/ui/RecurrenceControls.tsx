
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecurrenceControlsProps {
  isRecurring: boolean;
  frequency: string;
  onIsRecurringChange: (value: boolean) => void;
  onFrequencyChange: (value: string) => void;
}

const RecurrenceControls: React.FC<RecurrenceControlsProps> = ({
  isRecurring,
  frequency,
  onIsRecurringChange,
  onFrequencyChange,
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
      )}
    </div>
  );
};

export default RecurrenceControls;
