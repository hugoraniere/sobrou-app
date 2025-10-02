export const clearAllCaches = async (): Promise<boolean> => {
  try {
    console.log('[CACHE] Clearing all browser caches...');
    
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log('[CACHE] Found caches:', cacheNames);
      
      const deletePromises = cacheNames.map(cacheName => {
        console.log(`[CACHE] Deleting cache: ${cacheName}`);
        return caches.delete(cacheName);
      });
      
      await Promise.all(deletePromises);
      console.log('[CACHE] All caches cleared');
    }

    return true;
  } catch (error) {
    console.error('[CACHE] Error clearing cache:', error);
    return false;
  }
};

export const refreshPage = (): void => {
  console.log('[CACHE] Refreshing page...');
  window.location.reload();
};

export const unregisterAllServiceWorkers = async (): Promise<boolean> => {
  try {
    console.log('[CACHE] Unregistering all service workers...');
    
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('[CACHE] Found service workers:', registrations.length);
      
      const unregisterPromises = registrations.map(registration => {
        console.log(`[CACHE] Unregistering service worker: ${registration.scope}`);
        return registration.unregister();
      });
      
      await Promise.all(unregisterPromises);
      console.log('[CACHE] All service workers unregistered');
    }
    
    return true;
  } catch (error) {
    console.error('[CACHE] Error unregistering service workers:', error);
    return false;
  }
};

export const clearAllAndHardReload = async (): Promise<void> => {
  console.log('[CACHE] Starting complete cache clear and reload...');
  
  await clearAllCaches();
  await unregisterAllServiceWorkers();
  
  console.log('[CACHE] Performing hard reload...');
  window.location.reload();
};

export const clearCacheAndRefresh = async (): Promise<void> => {
  const cleared = await clearAllCaches();
  if (cleared) {
    setTimeout(refreshPage, 500);
  }
};