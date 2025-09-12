export function calcDelta(current: number, previous: number): { deltaPct: number; trend: 'up' | 'down' | 'flat' } {
  if (previous === 0) {
    return {
      deltaPct: current > 0 ? 100 : 0,
      trend: current > 0 ? 'up' : 'flat'
    };
  }

  const delta = ((current - previous) / previous) * 100;
  
  return {
    deltaPct: Math.abs(delta),
    trend: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
  };
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'agora mesmo';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `há ${days} dia${days > 1 ? 's' : ''}`;
  }
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString('pt-BR');
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function generateMockAnalyticsEvents(count: number = 100) {
  const events = ['session_start', 'login_success', 'login_error', 'page_view'];
  const pages = ['/dashboard', '/transactions', '/bills', '/profile', '/settings'];
  const reasons = ['invalid_credentials', 'network_error', 'account_locked'];
  
  return Array.from({ length: count }, (_, i) => {
    const eventName = events[Math.floor(Math.random() * events.length)];
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    return {
      id: `mock-${i}`,
      event_name: eventName,
      user_id: `user-${Math.floor(Math.random() * 50)}`,
      session_id: `session-${Math.floor(Math.random() * 20)}`,
      page: pages[Math.floor(Math.random() * pages.length)],
      event_params: eventName === 'login_error' 
        ? { reason: reasons[Math.floor(Math.random() * reasons.length)] }
        : {},
      created_at: createdAt.toISOString()
    };
  });
}

export function convertLegacyMetrics(legacyData: any) {
  // Helper to convert old metric formats to new structure
  return {
    total_users: legacyData.totalUsers || 0,
    active_users: legacyData.activeUsers || 0,
    subscribers: legacyData.subscribers || 0,
    conversion_rate: legacyData.conversionRate || 0,
    sla_compliance: legacyData.slaCompliance || 0
  };
}