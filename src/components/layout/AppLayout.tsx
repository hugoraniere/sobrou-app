
import React, { useState } from 'react';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import MainNavbar from '../navigation/MainNavbar';
import FloatingChatButton from '../chat/FloatingChatButton';
import ChatWindow from '../chat/ChatWindow';

interface AppLayoutContentProps {
  children: React.ReactNode;
}

const AppLayoutContent: React.FC<AppLayoutContentProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <div className="min-h-screen w-full bg-background-surface flex">
      {/* Fixed Sidebar */}
      <AppSidebar />
      
      {/* Main content area with responsive margin */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: isExpanded ? '256px' : '64px' 
        }}
      >
        {/* Top navbar */}
        <MainNavbar />
        
        {/* Main content */}
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 overflow-x-hidden w-full max-w-full">
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
