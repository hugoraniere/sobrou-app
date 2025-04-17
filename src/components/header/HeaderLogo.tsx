
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLogo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/logo.png" 
          alt="Sobrou Logo" 
          className="h-8 w-auto mr-2" 
        />
      </Link>
    </div>
  );
};

export default HeaderLogo;
