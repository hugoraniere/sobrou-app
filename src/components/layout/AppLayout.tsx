
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import MainNavbar from '../navigation/MainNavbar';
import FloatingChatButton from '../chat/FloatingChatButton';
import ChatWindow from '../chat/ChatWindow';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background-surface flex">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top navbar */}
          <MainNavbar />
          
          {/* Main content */}
          <main className="flex-1 w-full overflow-x-hidden">
            {/* Sidebar trigger for mobile */}
            <div className="md:hidden p-4">
              <SidebarTrigger />
            </div>
            
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
    </SidebarProvider>
  );
};

export default AppLayout;
