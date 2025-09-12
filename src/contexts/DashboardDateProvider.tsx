import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type PeriodType = 'today' | '7d' | '30d' | '90d' | 'custom';

export interface DateRange {
  dateFrom: Date;
  dateTo: Date;
  compareFrom?: Date;
  compareTo?: Date;
}

interface DashboardDateContextType {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  customDateRange?: { start: Date; end: Date };
  setCustomDateRange: (range: { start: Date; end: Date }) => void;
  compareEnabled: boolean;
  setCompareEnabled: (enabled: boolean) => void;
  dateRange: DateRange;
  isLoading: boolean;
}

const DashboardDateContext = createContext<DashboardDateContextType | undefined>(undefined);

export function useDashboardPeriod() {
  const context = useContext(DashboardDateContext);
  if (!context) {
    throw new Error('useDashboardPeriod must be used within DashboardDateProvider');
  }
  return context;
}

export function DashboardDateProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [period, setPeriodState] = useState<PeriodType>(() => {
    const paramPeriod = searchParams.get('period') as PeriodType;
    return paramPeriod && ['today', '7d', '30d', '90d', 'custom'].includes(paramPeriod) ? paramPeriod : '30d';
  });
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date }>();
  const [compareEnabled, setCompareEnabled] = useState(searchParams.get('compare') === 'true');
  const [isLoading, setIsLoading] = useState(false);

  const setPeriod = (newPeriod: PeriodType) => {
    setPeriodState(newPeriod);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('period', newPeriod);
    setSearchParams(newParams);
  };

  const dateRange: DateRange = React.useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let dateFrom: Date;
    let dateTo = today;

    switch (period) {
      case 'today':
        dateFrom = today;
        break;
      case '7d':
        dateFrom = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFrom = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFrom = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        if (customDateRange) {
          dateFrom = customDateRange.start;
          dateTo = customDateRange.end;
        } else {
          dateFrom = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        break;
      default:
        dateFrom = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const result: DateRange = { dateFrom, dateTo };

    if (compareEnabled) {
      const daysDiff = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (24 * 60 * 60 * 1000));
      result.compareTo = new Date(dateFrom.getTime() - 24 * 60 * 60 * 1000);
      result.compareFrom = new Date(result.compareTo.getTime() - daysDiff * 24 * 60 * 60 * 1000);
    }

    return result;
  }, [period, customDateRange, compareEnabled]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('compare', compareEnabled.toString());
    setSearchParams(newParams);
  }, [compareEnabled, searchParams, setSearchParams]);

  return (
    <DashboardDateContext.Provider value={{
      period,
      setPeriod,
      customDateRange,
      setCustomDateRange,
      compareEnabled,
      setCompareEnabled,
      dateRange,
      isLoading
    }}>
      {children}
    </DashboardDateContext.Provider>
  );
}