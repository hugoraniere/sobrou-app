import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

export const calculateInstallments = (
  startDate: Date, 
  endDate: Date, 
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
): number => {
  if (startDate >= endDate) return 1;

  switch (frequency) {
    case 'daily':
      return Math.ceil(differenceInDays(endDate, startDate)) + 1;
    case 'weekly':
      return Math.ceil(differenceInWeeks(endDate, startDate)) + 1;
    case 'monthly':
      return Math.ceil(differenceInMonths(endDate, startDate)) + 1;
    case 'yearly':
      return Math.ceil(differenceInYears(endDate, startDate)) + 1;
    default:
      return 1;
  }
};