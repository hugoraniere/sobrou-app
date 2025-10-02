
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config'

// PWA removido


// Development debug info
console.log('[APP] Build:', import.meta.env.VITE_APP_BUILD_ID || 'dev');
console.log('[APP] Mode:', import.meta.env.MODE);

createRoot(document.getElementById("root")!).render(<App />);
