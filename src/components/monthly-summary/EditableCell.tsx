
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrencyInput, parseCurrencyToNumber, formatCurrencyForDisplay } from '@/utils/currencyUtils';
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
      // Mostrar valor sem formatação durante a edição
      setInputValue(value === 0 ? '' : value.toString().replace('.', ','));
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
      setInputValue(value === 0 ? '' : value.toString().replace('.', ','));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setInputValue(formatted);
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("text-center text-xs h-6 px-1", className)}
        placeholder="0,00"
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "text-center text-xs cursor-pointer hover:bg-gray-50 px-1 py-1 rounded transition-colors min-h-[24px] flex items-center justify-center",
        className
      )}
      title="Clique para editar"
    >
      {formatCurrencyForDisplay(value)}
    </div>
  );
};
