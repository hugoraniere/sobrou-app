// PWA registration using vite-plugin-pwa virtual register with update prompt
import { registerSW } from 'virtual:pwa-register';

export interface PWAUpdatePrompt {
  needRefresh: boolean;
  updateServiceWorker: () => void;
}

let updatePrompt: PWAUpdatePrompt | null = null;

export const registerPWA = () => {
  if (!('serviceWorker' in navigator)) return;

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updatePrompt = {
        needRefresh: true,
        updateServiceWorker: () => {
          updateSW(true);
        },
      };

      import('sonner').then(({ toast }) => {
        toast('Atualização disponível!', {
          description: 'Uma nova versão do app está disponível.',
          action: {
            label: 'Atualizar',
            onClick: () => updatePrompt?.updateServiceWorker(),
          },
          duration: 10000,
        });
      });
    },
    onRegisteredSW(swUrl, registration) {
      console.log('[PWA] Registered:', swUrl, registration);
    },
    onRegisterError(error) {
      console.error('[PWA] Registration error:', error);
    },
  });
};

export const getUpdatePrompt = () => updatePrompt;