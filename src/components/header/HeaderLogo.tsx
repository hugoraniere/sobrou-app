
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LogoWithAlphaBadge from '../brand/LogoWithAlphaBadge';

const HeaderLogo: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center">
        <LogoWithAlphaBadge size="md" />
      </Link>
    </div>
  );
};

export default HeaderLogo;
