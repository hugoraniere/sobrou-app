
import React, { useState } from 'react';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import MainNavbar from '../navigation/MainNavbar';
import FloatingChatButton from '../chat/FloatingChatButton';
import ChatWindow from '../chat/ChatWindow';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface AppLayoutContentProps {
  children: React.ReactNode;
}

const AppLayoutContent: React.FC<AppLayoutContentProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { state } = useSidebar();
  const { isMobile } = useResponsive();
  const isExpanded = state === 'expanded';

  return (
    <div className="min-h-screen w-full bg-background-surface flex">
      {/* Fixed Sidebar - Only on desktop */}
      {!isMobile && <AppSidebar />}
      
      {/* Main content area with responsive margin */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          !isMobile && (isExpanded ? "ml-64" : "ml-16")
        )}
      >
        {/* Top navbar */}
        <MainNavbar />
        
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

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
};

export default AppLayout;
