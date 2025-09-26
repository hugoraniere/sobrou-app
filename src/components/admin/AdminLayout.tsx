import React, { useState } from 'react';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import MainNavbar from '../navigation/MainNavbar';
import AdminMobileNavigation from './AdminMobileNavigation';

import FloatingChatButton from '../chat/FloatingChatButton';
import ChatWindow from '../chat/ChatWindow';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface AdminLayoutContentProps {
  children: React.ReactNode;
}

const AdminLayoutContent: React.FC<AdminLayoutContentProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { state } = useSidebar();
  const { isMobile } = useResponsive();
  const isExpanded = state === 'expanded';

  return (
    <div className="min-h-screen w-full bg-background-base flex">
      {/* Fixed Sidebar - Only on desktop */}
      {!isMobile && <AdminSidebar />}
      
      {/* Main content area with responsive margin */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          !isMobile && (isExpanded ? "ml-64" : "ml-16")
        )}
      >
        {/* Top navbar with admin context and mobile menu */}
        <div className="fixed top-0 left-0 right-0 z-50 w-full bg-background-base border-b border-border-subtle shadow-sm h-16">
          <div className="flex justify-between items-center h-full px-4 md:px-6">
            <MainNavbar isAdminContext={true} />
            {/* Mobile Admin Menu - positioned on the right */}
            {isMobile && (
              <div className="flex items-center">
                <AdminMobileNavigation />
              </div>
            )}
          </div>
        </div>
        
        {/* Main content with top padding to account for fixed navbar */}
        <main className="flex-1 w-full pt-16">
          <div className="w-full mx-auto">
            {children}
          </div>

          {/* Chat Components */}
          <FloatingChatButton 
            isOpen={isChatOpen}
            onClick={() => setIsChatOpen(!isChatOpen)}
          />
          <ChatWindow
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </main>
      </div>
    </div>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
};

export default AdminLayout;