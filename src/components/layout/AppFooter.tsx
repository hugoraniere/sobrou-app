import React from 'react';

const AppFooter: React.FC = () => {
  const buildInfo = {
    version: import.meta.env.VITE_APP_BUILD_ID || 'dev',
    mode: import.meta.env.MODE,
  };

  return (
    <footer className="mt-auto py-4 px-4 text-center text-xs text-muted-foreground border-t border-border-subtle">
      <div className="flex justify-center items-center gap-4">
        <span>v{buildInfo.version}</span>
        {buildInfo.mode === 'development' && (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
            DEV
          </span>
        )}
      </div>
    </footer>
  );
};

export default AppFooter;