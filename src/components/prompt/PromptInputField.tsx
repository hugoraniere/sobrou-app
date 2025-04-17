
import React from 'react';
import { Input } from "@/components/ui/input";
import CategorySelector from './CategorySelector';
import TransactionDatePicker from './TransactionDatePicker';

interface PromptInputFieldProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categoryId: string | null;
  userSelectedCategory: string | null;
  isCategoryPopoverOpen: boolean;
  setIsCategoryPopoverOpen: (isOpen: boolean) => void;
  handleCategorySelect: (categoryId: string) => void;
  resetCategory: (e: React.MouseEvent) => void;
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
  isProcessing: boolean;
}

const PromptInputField: React.FC<PromptInputFieldProps> = ({
  inputValue,
  onInputChange,
  categoryId,
  userSelectedCategory,
  isCategoryPopoverOpen,
  setIsCategoryPopoverOpen,
  handleCategorySelect,
  resetCategory,
  selectedDate,
  onDateChange,
  isProcessing
}) => {
  return (
    <div className="flex-grow relative">
      <Input
        value={inputValue}
        onChange={onInputChange}
        placeholder="ex: Gastei R$35 no mercado ontem"
        className="w-full pr-24"
        disabled={isProcessing}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        {categoryId && (
          <CategorySelector
            categoryId={categoryId}
            isOpen={isCategoryPopoverOpen}
            setIsOpen={setIsCategoryPopoverOpen}
            onCategorySelect={handleCategorySelect}
            onReset={resetCategory}
            userSelected={!!userSelectedCategory}
          />
        )}
        <TransactionDatePicker
          date={selectedDate}
          onDateChange={(date) => date && onDateChange(date)}
        />
      </div>
    </div>
  );
};

export default PromptInputField;
