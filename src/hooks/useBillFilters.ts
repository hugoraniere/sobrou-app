
import { useMemo } from 'react';
import { Bill, BillPeriodFilter } from '@/types/bills';
import { 
  isToday, 
  isTomorrow, 
  isThisWeek, 
  isThisMonth, 
  isPast, 
  parseISO 
} from 'date-fns';

export const useBillFilters = (bills: Bill[], filter: BillPeriodFilter) => {
  const filteredBills = useMemo(() => {
    const unpaidBills = bills.filter(bill => !bill.is_paid);
    
    switch (filter) {
      case 'overdue':
        return unpaidBills.filter(bill => 
          isPast(parseISO(bill.due_date)) && !isToday(parseISO(bill.due_date))
        );
      case 'today':
        return unpaidBills.filter(bill => 
          isToday(parseISO(bill.due_date))
        );
      case 'tomorrow':
        return unpaidBills.filter(bill => 
          isTomorrow(parseISO(bill.due_date))
        );
      case 'this-week':
        return unpaidBills.filter(bill => 
          isThisWeek(parseISO(bill.due_date), { weekStartsOn: 0 })
        );
      case 'this-month':
        return unpaidBills.filter(bill => 
          isThisMonth(parseISO(bill.due_date))
        );
      case 'all':
      default:
        return unpaidBills;
    }
  }, [bills, filter]);

  const billCounts = useMemo(() => {
    const unpaidBills = bills.filter(bill => !bill.is_paid);
    
    return {
      overdue: unpaidBills.filter(bill => 
        isPast(parseISO(bill.due_date)) && !isToday(parseISO(bill.due_date))
      ).length,
      today: unpaidBills.filter(bill => 
        isToday(parseISO(bill.due_date))
      ).length,
      tomorrow: unpaidBills.filter(bill => 
        isTomorrow(parseISO(bill.due_date))
      ).length,
      thisWeek: unpaidBills.filter(bill => 
        isThisWeek(parseISO(bill.due_date), { weekStartsOn: 0 })
      ).length,
      thisMonth: unpaidBills.filter(bill => 
        isThisMonth(parseISO(bill.due_date))
      ).length,
      all: unpaidBills.length,
    };
  }, [bills]);

  return {
    filteredBills,
    billCounts,
  };
};
