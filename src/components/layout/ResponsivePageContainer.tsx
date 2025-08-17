
import React from 'react';
import { getSectionContainer } from '@/constants/layoutTokens';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsivePageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsivePageContainer: React.FC<ResponsivePageContainerProps> = ({
  children,
  className = ''
}) => {
  const { isMobile } = useResponsive();

  return (
    <div className={`${getSectionContainer()} ${isMobile ? 'w-screen max-w-full' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsivePageContainer;
