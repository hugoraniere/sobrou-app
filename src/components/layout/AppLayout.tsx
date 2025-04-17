
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';
import MobileSidebar from './MobileSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Desktop Sidebar - Always visible, just collapsed on smaller screens */}
        <div className="hidden md:flex">
          <SidebarNav />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          <div className="md:hidden flex items-center p-4 border-b bg-white sticky top-0 z-10">
            <MobileSidebar />
            <div className="flex items-center ml-2">
              <img 
                src="/lovable-uploads/logo.png" 
                alt="Sobrou Logo" 
                className="h-6 w-auto mr-2" 
              />
            </div>
          </div>
          
          <div className="flex-1 px-5 sm:px-6 md:px-8 py-4 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
