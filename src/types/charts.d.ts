
export interface DailyData {
  day: string;
  income: number;
  expense: number;
  balance: number;
  cumulativeBalance: number;
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    theme: {
      light: string;
      dark: string;
    };
  };
}
