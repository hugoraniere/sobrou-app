
import React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface TransactionPaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TransactionPaginationControls: React.FC<TransactionPaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <Pagination className="mt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer rounded-full"}
          />
        </PaginationItem>
        
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
          // Simplified pagination display
          let pageNum;
          
          if (totalPages <= 5) {
            // Show all pages if 5 or fewer
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            // At start, show first 5 pages
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            // At end, show last 5 pages
            pageNum = totalPages - 4 + i;
          } else {
            // In middle, show current page and 2 pages before/after
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={currentPage === pageNum}
                onClick={() => onPageChange(pageNum)}
                className="cursor-pointer rounded-full h-8 w-8 text-sm p-0 flex items-center justify-center"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer rounded-full"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TransactionPaginationControls;
