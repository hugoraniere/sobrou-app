
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
    setSelectedCell(position);
    dragStartValue.current = value;
    setFillRange(null);
  }, []);

  const startDrag = useCallback((position: CellPosition, value: number) => {
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
    
    setFillRange({
      start: selectedCell,
      end: endPosition
    });
  }, [selectedCell, isDragging]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    return fillRange;
  }, [fillRange]);

  const clearSelection = useCallback(() => {
    setSelectedCell(null);
    setFillRange(null);
    setIsDragging(false);
  }, []);

  const getCellsInRange = useCallback((range: FillRange): CellPosition[] => {
    const cells: CellPosition[] = [];
    const { start, end } = range;
    
    // Determinar direção do preenchimento
    const minMonth = Math.min(start.monthIndex, end.monthIndex);
    const maxMonth = Math.max(start.monthIndex, end.monthIndex);
    
    // Para preenchimento horizontal (mesmo categoryId, diferentes meses)
    if (start.categoryId === end.categoryId) {
      for (let month = minMonth; month <= maxMonth; month++) {
        cells.push({
          categoryId: start.categoryId,
          monthIndex: month,
          section: start.section
        });
      }
    }
    
    return cells;
  }, []);

  const isInFillRange = useCallback((position: CellPosition): boolean => {
    if (!fillRange) return false;
    
    const cellsInRange = getCellsInRange(fillRange);
    return cellsInRange.some(cell => 
      cell.categoryId === position.categoryId && 
      cell.monthIndex === position.monthIndex &&
      cell.section === position.section
    );
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
