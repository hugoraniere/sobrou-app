
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { transactionCategories } from '@/data/categories';
import { useTranslation } from 'react-i18next';
import { Transaction } from '@/services/TransactionService';

interface TransactionDetailsProps {
  transaction: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  className?: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  onInputChange,
  handleSelectChange,
  className
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          {t('transactions.date', 'Data')}
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={transaction.date}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          {t('transactions.type', 'Tipo')}
        </Label>
        <Select 
          name="type" 
          value={transaction.type}
          onValueChange={(value) => handleSelectChange('type', value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder={t('transactions.selectType', 'Selecione o tipo')} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="income">{t('common.income', 'Receita')}</SelectItem>
            <SelectItem value="expense">{t('common.expense', 'Despesa')}</SelectItem>
            <SelectItem value="transfer">{t('transactions.transfer', 'Transferência')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          {t('transactions.category', 'Categoria')}
        </Label>
        <Select 
          name="category" 
          value={transaction.category}
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder={t('transactions.selectCategory', 'Selecione a categoria')} />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-[300px]">
            {transactionCategories.map((category) => {
              const Icon = category.icon;
              return (
                <SelectItem key={category.id} value={category.id}>
                  {Icon && <Icon className="mr-2 inline h-4 w-4" />}
                  {category.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          {t('transactions.description', 'Descrição')}
        </Label>
        <Input
          id="description"
          name="description"
          value={transaction.description}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">
          {t('transactions.amount', 'Valor')}
        </Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={transaction.amount}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
    </>
  );
};

export default TransactionDetails;
