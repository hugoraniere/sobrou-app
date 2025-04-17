
import React from 'react';
import MobileSidebar from './MobileSidebar';

const MobileHeader: React.FC = () => {
  return (
    <div className="md:hidden flex items-center p-4 border-b bg-background-base sticky top-0 z-10">
      <MobileSidebar />
      <div className="flex items-center ml-2">
        <img 
          src="/lovable-uploads/logo.png" 
          alt="Sobrou Logo" 
          className="h-6 w-auto mr-2" 
        />
      </div>
    </div>
  );
};

export default MobileHeader;
