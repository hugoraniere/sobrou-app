
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
    <div className={`${isMobile ? 'w-[100vw] max-w-[100vw] overflow-x-hidden px-4' : getSectionContainer()} pb-8 ${className}`}>
      {children}
    </div>
  );
};

export default ResponsivePageContainer;
