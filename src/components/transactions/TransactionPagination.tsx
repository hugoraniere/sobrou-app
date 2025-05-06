
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
}

const TransactionPagination: React.FC<TransactionPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="p-4 border-t flex justify-between items-center">
      <div className="text-sm text-gray-500">
        <span>
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} itens
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm">Itens por página:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    isActive={pageNumber === currentPage}
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {totalPages > 5 && (
              <PaginationItem>
                <span className="px-2">...</span>
              </PaginationItem>
            )}
            
            {totalPages > 5 && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => onPageChange(totalPages)}
                  isActive={totalPages === currentPage}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default TransactionPagination;
