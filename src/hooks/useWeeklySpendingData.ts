
import { useMemo } from 'react';
import { Transaction } from '@/services/transactions';
import { format, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeeklySpendingData {
  dayName: string;
  dayNameMobile: string;
  dayIndex: number;
  averageSpending: number;
  totalSpending: number;
  transactionCount: number;
}

interface WeeklySpendingInsight {
  highestSpendingDay: string;
  highestAmount: number;
  lowestSpendingDay: string;
  lowestAmount: number;
  totalAverage: number;
}

export const useWeeklySpendingData = (transactions: Transaction[]) => {
  const { weeklyData, insights } = useMemo(() => {
    // Filter only expenses
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) {
      return {
        weeklyData: [],
        insights: null
      };
    }
    
    // Days of week in Portuguese (Monday = 0, Sunday = 6)
    const dayNames = [
      'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
    ];
    
    // Mobile abbreviated versions
    const dayNamesMobile = [
      'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'
    ];
    
    // Initialize data structure for each day
    const dayData = dayNames.map((name, index) => ({
      dayName: name,
      dayNameMobile: dayNamesMobile[index],
      dayIndex: index,
      totalSpending: 0,
      transactionCount: 0,
      averageSpending: 0
    }));
    
    // Group expenses by day of week
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      // getDay returns 0 for Sunday, 1 for Monday, etc.
      // We need to convert to our format where Monday = 0
      let dayIndex = getDay(date) - 1;
      if (dayIndex === -1) dayIndex = 6; // Sunday becomes index 6
      
      dayData[dayIndex].totalSpending += expense.amount;
      dayData[dayIndex].transactionCount += 1;
    });
    
    // Calculate averages
    dayData.forEach(day => {
      if (day.transactionCount > 0) {
        day.averageSpending = day.totalSpending / day.transactionCount;
      }
    });
    
    // Filter out days with no transactions for insights
    const daysWithData = dayData.filter(day => day.transactionCount > 0);
    
    if (daysWithData.length === 0) {
      return {
        weeklyData: dayData,
        insights: null
      };
    }
    
    // Calculate insights
    const highestSpendingDay = daysWithData.reduce((max, day) => 
      day.averageSpending > max.averageSpending ? day : max
    );
    
    const lowestSpendingDay = daysWithData.reduce((min, day) => 
      day.averageSpending < min.averageSpending ? day : min
    );
    
    const totalAverage = daysWithData.reduce((sum, day) => sum + day.averageSpending, 0) / daysWithData.length;
    
    const insights: WeeklySpendingInsight = {
      highestSpendingDay: highestSpendingDay.dayName,
      highestAmount: highestSpendingDay.averageSpending,
      lowestSpendingDay: lowestSpendingDay.dayName,
      lowestAmount: lowestSpendingDay.averageSpending,
      totalAverage
    };
    
    return {
      weeklyData: dayData,
      insights
    };
  }, [transactions]);
  
  return { weeklyData, insights };
};
