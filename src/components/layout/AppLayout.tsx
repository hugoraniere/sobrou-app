
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';
import MobileSidebar from './MobileSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <SidebarNav />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          <div className="md:hidden flex items-center p-4 border-b">
            <MobileSidebar />
            <span className="ml-2 text-xl font-bold">Sobrou</span>
          </div>
          
          <div className="flex-1 p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
