import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Redirect to PublicLanding with query params to open auth modal
    const tab = searchParams.get('tab');
    const redirect = searchParams.get('redirect');
    const verification = searchParams.get('verification');
    
    let queryString = '?auth=1';
    if (tab) queryString += `&tab=${tab}`;
    if (redirect) queryString += `&redirect=${encodeURIComponent(redirect)}`;
    if (verification) queryString += `&verification=${verification}`;
    
    navigate(`/${queryString}`, { replace: true });
  }, [navigate, searchParams]);

  return null;
};

export default Auth;
