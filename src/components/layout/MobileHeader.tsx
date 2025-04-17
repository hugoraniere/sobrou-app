
import React from 'react';
import MobileSidebar from './MobileSidebar';
import { Link } from 'react-router-dom';

const MobileHeader: React.FC = () => {
  return (
    <div className="md:hidden flex items-center p-4 border-b bg-background-base sticky top-0 z-10">
      <MobileSidebar />
      <div className="flex items-center ml-2">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/logo.png" 
            alt="Logo" 
            className="h-6 w-auto" 
          />
        </Link>
      </div>
    </div>
  );
};

export default MobileHeader;
