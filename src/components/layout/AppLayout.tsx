
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';
import MobileSidebar from './MobileSidebar';
import { Wallet } from 'lucide-react';

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
        <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          <div className="md:hidden flex items-center p-4 border-b">
            <MobileSidebar />
            <div className="flex items-center ml-2">
              <Wallet className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-xl font-bold">Sobrou</span>
            </div>
          </div>
          
          <div className="flex-1 px-5 sm:px-6 md:px-8 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
