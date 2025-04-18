
import React from 'react';
import MobileSidebar from './MobileSidebar';
import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';

const MobileHeader: React.FC = () => {
  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b bg-background-base sticky top-0 z-10">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <Logo size="sm" />
        </Link>
      </div>
      <MobileSidebar />
    </div>
  );
};

export default MobileHeader;

