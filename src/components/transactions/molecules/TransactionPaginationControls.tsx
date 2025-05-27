
import React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const { isMobile } = useResponsive();
  
  if (totalPages <= 1) return null;
  
  if (isMobile) {
    return (
      <div className="flex items-center justify-between py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        
        <span className="text-sm text-gray-600">
          {currentPage} de {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center"
        >
          Próximo
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  }
  
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
          let pageNum;
          
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
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
