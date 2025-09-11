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

interface BlogBreadcrumbProps {
  category?: string;
  postTitle?: string;
}

const BlogBreadcrumb: React.FC<BlogBreadcrumbProps> = ({ category, postTitle }) => {
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
          {postTitle || category ? (
            <BreadcrumbLink asChild>
              <Link to="/blog">Blog</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Blog</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {category && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {postTitle ? (
                <BreadcrumbLink asChild>
                  <Link to={`/blog?category=${encodeURIComponent(category)}`}>
                    {category}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{category}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {postTitle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px]">
                {postTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BlogBreadcrumb;