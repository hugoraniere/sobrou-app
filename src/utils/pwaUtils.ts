export const clearPWACache = async (): Promise<boolean> => {
  try {
    console.log('[PWA] Clearing service worker caches...');
    
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log('[PWA] Found caches:', cacheNames);
      
      const deletePromises = cacheNames.map(cacheName => {
        console.log(`[PWA] Deleting cache: ${cacheName}`);
        return caches.delete(cacheName);
      });
      
      await Promise.all(deletePromises);
      console.log('[PWA] All caches cleared');
    }

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      console.log('[PWA] Posting message to service worker to clear caches');
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE'
      });
    }

    return true;
  } catch (error) {
    console.error('[PWA] Error clearing cache:', error);
    return false;
  }
};

export const refreshPage = (): void => {
  console.log('[PWA] Refreshing page...');
  window.location.reload();
};

export const unregisterAllServiceWorkers = async (): Promise<boolean> => {
  try {
    console.log('[PWA] Unregistering all service workers...');
    
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('[PWA] Found service workers:', registrations.length);
      
      const unregisterPromises = registrations.map(registration => {
        console.log(`[PWA] Unregistering service worker: ${registration.scope}`);
        return registration.unregister();
      });
      
      await Promise.all(unregisterPromises);
      console.log('[PWA] All service workers unregistered');
    }
    
    return true;
  } catch (error) {
    console.error('[PWA] Error unregistering service workers:', error);
    return false;
  }
};

export const clearAllAndHardReload = async (): Promise<void> => {
  console.log('[PWA] Starting complete cache clear and reload...');
  
  await clearPWACache();
  await unregisterAllServiceWorkers();
  
  console.log('[PWA] Performing hard reload...');
  window.location.reload();
};

export const clearCacheAndRefresh = async (): Promise<void> => {
  const cleared = await clearPWACache();
  if (cleared) {
    setTimeout(refreshPage, 500);
  }
};