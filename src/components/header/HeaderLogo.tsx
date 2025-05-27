
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '../brand/Logo';

const HeaderLogo: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center">
      <Link to={user ? "/" : "/"} className="flex items-center">
        <Logo size="md" />
      </Link>
    </div>
  );
};

export default HeaderLogo;
