
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/logo.png" 
          alt="Logo" 
          className="h-8 w-auto" 
        />
      </Link>
    </div>
  );
};

export default HeaderLogo;
