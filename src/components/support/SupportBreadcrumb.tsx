import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface SupportBreadcrumbProps {
  currentPage?: string;
  articleTitle?: string;
}

const SupportBreadcrumb: React.FC<SupportBreadcrumbProps> = ({ currentPage, articleTitle }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Início
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {currentPage || articleTitle ? (
            <BreadcrumbLink asChild>
              <Link to="/suporte">Central de Ajuda</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Central de Ajuda</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {currentPage && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {articleTitle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px]">
                {articleTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default SupportBreadcrumb;