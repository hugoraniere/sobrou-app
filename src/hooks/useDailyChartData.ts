
import { Transaction } from '@/services/transactions';
import { DailyData } from '@/types/charts';

export interface NegativePeriod {
  start: number;
  end: number;
}

export const useDailyChartData = (transactions: Transaction[]) => {
  // Function to get daily data for the current month
  const getDailyData = (): DailyData[] => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Create a map to store daily totals
    const dailyMap = new Map<string, DailyData>();
    
    // Get all days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Initialize all days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = i.toString();
      dailyMap.set(dayStr, { 
        day: dayStr, 
        income: 0, 
        expense: 0, 
        balance: 0,
        cumulativeBalance: 0 
      });
    }
    
    // Process transactions for the current month
    transactions
      .filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .forEach(transaction => {
        const date = new Date(transaction.date);
        const day = date.getDate().toString();
        
        let dailyData = dailyMap.get(day) || { 
          day, 
          income: 0, 
          expense: 0, 
          balance: 0,
          cumulativeBalance: 0 
        };
        
        if (transaction.type === 'income') {
          dailyData.income += transaction.amount;
        } else {
          dailyData.expense += transaction.amount;
        }
        
        dailyData.balance = dailyData.income - dailyData.expense;
        dailyMap.set(day, dailyData);
      });
    
    // Convert map to array and sort by day
    let result = Array.from(dailyMap.values())
      .sort((a, b) => parseInt(a.day) - parseInt(b.day));
      
    // Calculate cumulative balance
    let runningBalance = 0;
    result = result.map(day => {
      runningBalance += day.balance;
      return {
        ...day,
        cumulativeBalance: runningBalance
      };
    });
    
    return result;
  };

  const findNegativePeriods = (data: DailyData[]): NegativePeriod[] => {
    const negativeRanges: NegativePeriod[] = [];
    let currentRange: NegativePeriod | null = null;
    
    data.forEach((day) => {
      if (day.cumulativeBalance < 0) {
        if (!currentRange) {
          currentRange = { start: parseInt(day.day), end: parseInt(day.day) };
        } else {
          currentRange.end = parseInt(day.day);
        }
      } else if (currentRange) {
        negativeRanges.push(currentRange);
        currentRange = null;
      }
    });
    
    if (currentRange) {
      negativeRanges.push(currentRange);
    }
    
    return negativeRanges;
  };

  const dailyData = getDailyData();
  const negativePeriods = findNegativePeriods(dailyData);
  
  const getInsightMessage = (): string => {
    if (negativePeriods.length === 0) {
      return "Seu saldo se manteve positivo durante todo o mês.";
    }
    
    const period = negativePeriods[0];
    return `Seu saldo entra no vermelho entre os dias ${period.start} e ${period.end}.`;
  };

  return {
    dailyData,
    negativePeriods,
    getInsightMessage,
  };
};
