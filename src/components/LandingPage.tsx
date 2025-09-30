
import React from 'react';
import { Navigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  // Redirect to the main landing page
  return <Navigate to="/" replace />;
};

export default LandingPage;
