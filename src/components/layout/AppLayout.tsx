
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';
import MobileHeader from './MobileHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background-surface">
        {/* Desktop Sidebar - Fixed and full height */}
        <div className="hidden md:block">
          <SidebarNav />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden md:ml-64">
          {/* Mobile Header */}
          <MobileHeader />
          
          <div className="flex-1 px-5 sm:px-6 md:px-8 py-4 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
