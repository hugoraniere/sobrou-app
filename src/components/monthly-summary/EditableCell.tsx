
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrencyInput, parseCurrencyToNumber } from '@/utils/currencyUtils';
import { cn } from '@/lib/utils';

interface EditableCellProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setInputValue(value === 0 ? '' : formatCurrencyInput(value.toString()));
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [isEditing, value]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const numericValue = parseCurrencyToNumber(inputValue);
    onChange(numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value === 0 ? '' : formatCurrencyInput(value.toString()));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setInputValue(formatted);
  };

  const displayValue = value === 0 ? '-' : value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("text-center text-sm h-8", className)}
        placeholder="0,00"
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "text-center text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors min-h-[32px] flex items-center justify-center",
        className
      )}
      title="Clique para editar"
    >
      {displayValue}
    </div>
  );
};
