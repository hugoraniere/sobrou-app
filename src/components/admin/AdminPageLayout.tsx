import React from 'react';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  className = ""
}) => {
  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden bg-background-base ${className}`}>
      <main className="w-full px-4 md:px-8 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        
        {children}
      </main>
    </div>
  );
};

export default AdminPageLayout;