
import { useState, useCallback, useRef } from 'react';

export interface CellPosition {
  categoryId: string;
  monthIndex: number;
  section: string;
}

export interface FillRange {
  start: CellPosition;
  end: CellPosition;
}

export const useDragFill = () => {
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [fillRange, setFillRange] = useState<FillRange | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartValue = useRef<number>(0);

  const selectCell = useCallback((position: CellPosition, value: number) => {
    console.log('Cell selected:', position, value);
    setSelectedCell(position);
    dragStartValue.current = value;
    setFillRange(null);
  }, []);

  const startDrag = useCallback((position: CellPosition, value: number) => {
    console.log('Drag started:', position, value);
    setIsDragging(true);
    dragStartValue.current = value;
    setFillRange({
      start: position,
      end: position
    });
  }, []);

  const updateDragRange = useCallback((endPosition: CellPosition) => {
    if (!selectedCell || !isDragging) return;
    
    // Verificar se estamos na mesma seção
    if (endPosition.section !== selectedCell.section) return;
    
    console.log('Updating drag range to:', endPosition);
    
    setFillRange({
      start: selectedCell,
      end: endPosition
    });
  }, [selectedCell, isDragging]);

  const endDrag = useCallback(() => {
    console.log('Drag ended, range:', fillRange);
    setIsDragging(false);
    const range = fillRange;
    // Não limpar o fillRange imediatamente para manter o feedback visual
    setTimeout(() => setFillRange(null), 200);
    return range;
  }, [fillRange]);

  const clearSelection = useCallback(() => {
    console.log('Selection cleared');
    setSelectedCell(null);
    setFillRange(null);
    setIsDragging(false);
  }, []);

  const getCellsInRange = useCallback((range: FillRange): CellPosition[] => {
    const cells: CellPosition[] = [];
    const { start, end } = range;
    
    console.log('Getting cells in range:', start, end);
    
    // Determinar direção do preenchimento
    const minMonth = Math.min(start.monthIndex, end.monthIndex);
    const maxMonth = Math.max(start.monthIndex, end.monthIndex);
    
    // Para preenchimento horizontal (mesmo categoryId, diferentes meses)
    if (start.categoryId === end.categoryId && start.section === end.section) {
      for (let month = minMonth; month <= maxMonth; month++) {
        cells.push({
          categoryId: start.categoryId,
          monthIndex: month,
          section: start.section
        });
      }
    }
    // Para preenchimento vertical (mesma coluna, diferentes categorias)
    else if (start.monthIndex === end.monthIndex && start.section === end.section) {
      // Por simplicidade, vamos focar no preenchimento horizontal por enquanto
      // Futuramente pode ser expandido para preenchimento vertical
      cells.push(start);
    }
    
    console.log('Cells in range:', cells);
    return cells;
  }, []);

  const isInFillRange = useCallback((position: CellPosition): boolean => {
    if (!fillRange) return false;
    
    const cellsInRange = getCellsInRange(fillRange);
    const inRange = cellsInRange.some(cell => 
      cell.categoryId === position.categoryId && 
      cell.monthIndex === position.monthIndex &&
      cell.section === position.section
    );
    
    return inRange;
  }, [fillRange, getCellsInRange]);

  return {
    selectedCell,
    fillRange,
    isDragging,
    dragStartValue: dragStartValue.current,
    selectCell,
    startDrag,
    updateDragRange,
    endDrag,
    clearSelection,
    getCellsInRange,
    isInFillRange
  };
};
