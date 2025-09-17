import { lazy } from 'react';

// Lazy load Recharts components to improve initial bundle size
export const LazyAreaChart = lazy(() => 
  import('recharts').then(module => ({ default: module.AreaChart }))
);

export const LazyBarChart = lazy(() => 
  import('recharts').then(module => ({ default: module.BarChart }))
);

export const LazyLineChart = lazy(() => 
  import('recharts').then(module => ({ default: module.LineChart }))
);

export const LazyPieChart = lazy(() => 
  import('recharts').then(module => ({ default: module.PieChart }))
);

export const LazyResponsiveContainer = lazy(() => 
  import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

export const LazyXAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.XAxis }))
);

export const LazyYAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.YAxis }))
);

export const LazyCartesianGrid = lazy(() => 
  import('recharts').then(module => ({ default: module.CartesianGrid }))
);

export const LazyTooltip = lazy(() => 
  import('recharts').then(module => ({ default: module.Tooltip }))
);

export const LazyLegend = lazy(() => 
  import('recharts').then(module => ({ default: module.Legend }))
);

export const LazyArea = lazy(() => 
  import('recharts').then(module => ({ default: module.Area }))
);

export const LazyBar = lazy(() => 
  import('recharts').then(module => ({ default: module.Bar }))
);

export const LazyLine = lazy(() => 
  import('recharts').then(module => ({ default: module.Line }))
);

export const LazyCell = lazy(() => 
  import('recharts').then(module => ({ default: module.Cell }))
);

export const LazyPie = lazy(() => 
  import('recharts').then(module => ({ default: module.Pie }))
);