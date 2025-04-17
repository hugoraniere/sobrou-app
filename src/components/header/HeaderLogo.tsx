
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';

const HeaderLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <Logo size="md" />
      </Link>
    </div>
  );
};

export default HeaderLogo;
