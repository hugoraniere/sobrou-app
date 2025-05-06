
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (perPage: number) => void;
}

const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const renderPageButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;
    
    if (totalPages <= maxButtonsToShow) {
      // Se o número total de páginas for menor ou igual ao número máximo de botões, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "outline"}
            size="sm"
            className="w-9 h-9 p-0"
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Sempre mostra a primeira página
      buttons.push(
        <Button
          key={1}
          variant={1 === currentPage ? "default" : "outline"}
          size="sm"
          className="w-9 h-9 p-0"
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      );
      
      // Determinar o intervalo de páginas a serem exibidas
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, start + 2);
      
      // Ajustar o início se o fim estiver muito próximo do final
      start = Math.max(2, end - 2);
      
      // Adicionar ellipsis se necessário
      if (start > 2) {
        buttons.push(<span key="ellipsis1" className="mx-1">...</span>);
      }
      
      // Adicionar páginas do intervalo calculado
      for (let i = start; i <= end; i++) {
        buttons.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "outline"}
            size="sm"
            className="w-9 h-9 p-0"
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        );
      }
      
      // Adicionar ellipsis se necessário
      if (end < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="mx-1">...</span>);
      }
      
      // Sempre mostra a última página
      if (totalPages > 1) {
        buttons.push(
          <Button
            key={totalPages}
            variant={totalPages === currentPage ? "default" : "outline"}
            size="sm"
            className="w-9 h-9 p-0"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        );
      }
    }
    
    return buttons;
  };
  
  // Não mostrar a paginação se não houver páginas
  if (totalPages <= 0) return null;
  
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleItemsPerPageChange = (value: string) => {
    onItemsPerPageChange(Number(value));
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t">
      <div className="mb-3 sm:mb-0 text-sm text-gray-500">
        Mostrando <span className="font-medium">{startItem}</span> a <span className="font-medium">{endItem}</span> de <span className="font-medium">{totalItems}</span> resultados
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center mr-4">
          <span className="text-sm mr-2">Itens por página:</span>
          <Select 
            value={String(itemsPerPage)} 
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[70px] h-9">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-1">
          {renderPageButtons()}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TransactionPagination;
