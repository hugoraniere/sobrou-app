
import React from 'react';
import { getResponsiveContainer } from '@/constants/layoutTokens';
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
    <div className={`${getResponsiveContainer(isMobile)} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsivePageContainer;
