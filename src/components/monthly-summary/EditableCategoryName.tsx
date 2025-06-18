
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableCategoryNameProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const EditableCategoryName: React.FC<EditableCategoryNameProps> = ({
  value,
  onChange,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setInputValue(value);
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
    const trimmedValue = inputValue.trim();
    if (trimmedValue && trimmedValue !== value) {
      onChange(trimmedValue);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("text-sm h-8 min-w-[120px]", className)}
        placeholder="Nome da categoria"
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors group",
        className
      )}
      title="Clique para editar"
    >
      <span className="text-sm">{value}</span>
      <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
