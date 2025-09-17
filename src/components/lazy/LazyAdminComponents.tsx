import { lazy } from 'react';

// Lazy load admin components to improve initial load for non-admin users
export const LazyUserManager = lazy(() => 
  import('@/components/blog/UserManager')
);

export const LazyTagManager = lazy(() => 
  import('@/components/admin/content/TagManager')
);

export const LazyFeaturedPostManager = lazy(() => 
  import('@/components/blog/FeaturedPostManager')
);

export const LazySobrouDashboard = lazy(() => 
  import('@/components/dashboard/SobrouDashboard')
);

export const LazyUserMetricsBigNumbers = lazy(() => 
  import('@/components/dashboard/UserMetricsBigNumbers')
);