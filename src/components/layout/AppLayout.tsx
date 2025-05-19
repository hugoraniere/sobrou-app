
import React, { useState } from 'react';
import MainNavbar from '../navigation/MainNavbar';
import FloatingChatButton from '../chat/FloatingChatButton';
import ChatWindow from '../chat/ChatWindow';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background-surface flex flex-col">
      {/* Barra de navegação superior */}
      <MainNavbar />
      
      {/* Conteúdo principal */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="px-4 sm:px-6 md:px-8 py-4 overflow-x-hidden w-full max-w-full">
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
  );
};

export default AppLayout;
