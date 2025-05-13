
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';
import MobileHeader from './MobileHeader';
import FloatingChatButton from '../chat/FloatingChatButton';
import ChatWindow from '../chat/ChatWindow';
import { useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background-surface">
        {/* Desktop Sidebar - Fixed and full height */}
        <div className="hidden md:block">
          <SidebarNav />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          {/* Mobile Header */}
          <MobileHeader />
          
          <div className="flex-1 px-4 sm:px-6 md:px-8 py-4 overflow-x-hidden w-full max-w-full">
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
    </SidebarProvider>
  );
};

export default AppLayout;
