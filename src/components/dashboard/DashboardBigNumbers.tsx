import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from '@/utils/currencyUtils';
import { Transaction } from '@/services/transactions';

interface DashboardBigNumbersProps {
  transactions: Transaction[];
  totalSavings: number;
}

const DashboardBigNumbers: React.FC<DashboardBigNumbersProps> = ({ 
  transactions,
  totalSavings
}) => {
  const { t } = useTranslation();
  
  // Calculate total income
  const totalIncome = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Calculate total expenses
  const totalExpenses = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Calculate balance
  const balance = totalIncome - totalExpenses;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Income Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.bigNumbers.income')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
        </CardContent>
      </Card>
      
      {/* Expenses Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.bigNumbers.expenses')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
        </CardContent>
      </Card>
      
      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.bigNumbers.balance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
        </CardContent>
      </Card>
      
      {/* Savings Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.bigNumbers.savings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSavings)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardBigNumbers;
