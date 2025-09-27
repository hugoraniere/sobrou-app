// PWA Registration and Update Handler
export interface PWAUpdatePrompt {
  needRefresh: boolean;
  updateServiceWorker: () => void;
}

let updatePrompt: PWAUpdatePrompt | null = null;

export const registerPWA = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('[PWA] Service worker registered:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New content available, will update on next restart');
                
                // Trigger update prompt
                updatePrompt = {
                  needRefresh: true,
                  updateServiceWorker: () => {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                };
                
                // Show toast notification
                import('sonner').then(({ toast }) => {
                  toast('Atualização disponível!', {
                    description: 'Uma nova versão do app está disponível.',
                    action: {
                      label: 'Atualizar',
                      onClick: updatePrompt?.updateServiceWorker
                    },
                    duration: 10000
                  });
                });
              }
            });
          }
        });
      })
      .catch(error => {
        console.log('[PWA] Service worker registration failed:', error);
      });
  }
};

export const getUpdatePrompt = () => updatePrompt;