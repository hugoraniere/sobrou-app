
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag, X, Calendar } from "lucide-react";
import TransactionDatePicker from './TransactionDatePicker';
import { transactionCategories } from '@/data/categories';

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

// Componente de seleção de categoria separado para uso dentro do PromptInputField
const CategorySelectorPopover: React.FC<{
  categoryId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCategorySelect: (categoryId: string) => void;
  onReset: (e: React.MouseEvent) => void;
  userSelected: boolean;
}> = ({ categoryId, isOpen, setIsOpen, onCategorySelect, onReset, userSelected }) => {
  const category = transactionCategories.find(c => c.value === categoryId);
  
  if (!category) return null;
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-6 w-6 p-0">
          <Tag className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2" align="end">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Categoria detectada</div>
            {userSelected && (
              <Button variant="ghost" size="sm" className="h-6 px-1" onClick={onReset}>
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Reset</span>
              </Button>
            )}
          </div>
          
          <div className="space-y-1">
            {transactionCategories.map((cat) => (
              <Badge
                key={cat.value}
                variant={cat.value === categoryId ? "default" : "outline"}
                className="mr-1 mb-1 cursor-pointer"
                onClick={() => onCategorySelect(cat.value)}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

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
          <CategorySelectorPopover
            categoryId={categoryId}
            isOpen={isCategoryPopoverOpen}
            setIsOpen={setIsCategoryPopoverOpen}
            onCategorySelect={handleCategorySelect}
            onReset={resetCategory}
            userSelected={!!userSelectedCategory}
          />
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-6 w-6 p-0">
              <Calendar className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <TransactionDatePicker
              date={selectedDate}
              onDateChange={onDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PromptInputField;
