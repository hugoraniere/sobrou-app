
import React from 'react';
import { getStandardTitle, getStandardDescription, getEdgeTopSpacing } from '@/constants/layoutTokens';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsivePageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  stackOnMobile?: boolean;
}

const ResponsivePageHeader: React.FC<ResponsivePageHeaderProps> = ({
  title,
  description,
  children,
  stackOnMobile = false
}) => {
  const { isMobile } = useResponsive();

  return (
    <div className={`${getEdgeTopSpacing()} mb-12 sm:mb-16`}>
      <div className={stackOnMobile && isMobile ? "space-y-4" : "flex justify-between items-start"}>
        <div className="flex-1">
          <h1 className={getStandardTitle()}>
            {title}
          </h1>
          {description && !isMobile && (
            <p className={getStandardDescription("mt-1 mx-0 text-left")}>
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className={stackOnMobile && isMobile ? "" : "ml-4"}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsivePageHeader;
