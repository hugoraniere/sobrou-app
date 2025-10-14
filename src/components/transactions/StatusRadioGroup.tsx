import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface StatusRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
}

export const StatusRadioGroup: React.FC<StatusRadioGroupProps> = ({ value, onChange }) => {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="paid" id="paid" />
        <Label htmlFor="paid" className="cursor-pointer">Pago</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="pending" id="pending" />
        <Label htmlFor="pending" className="cursor-pointer">Pendente</Label>
      </div>
    </RadioGroup>
  );
};
