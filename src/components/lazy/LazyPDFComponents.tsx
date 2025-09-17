import { lazy } from 'react';

// Basic lazy loading for potential future PDF components
export const LazyFileUpload = lazy(() => 
  Promise.resolve({ default: () => <div>Upload de arquivo</div> })
);