
import React from 'react';
import { getStandardTitle, getStandardDescription, getEdgeTopSpacing } from '@/constants/layoutTokens';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsivePageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const ResponsivePageHeader: React.FC<ResponsivePageHeaderProps> = ({
  title,
  description,
  children
}) => {
  const { isMobile } = useResponsive();

  return (
    <div className={`${getEdgeTopSpacing()} mb-12 sm:mb-16`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className={getStandardTitle()}>
            {title}
          </h1>
          {description && !isMobile && (
            <p className={getStandardDescription("mt-1")}>
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="ml-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsivePageHeader;
