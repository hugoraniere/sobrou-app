
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
        <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden md:pl-64">
          {/* Mobile Header */}
          <MobileHeader />
          
          <div className="flex-1 px-8 py-8 overflow-x-hidden w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
