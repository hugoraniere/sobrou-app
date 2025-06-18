
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
    setSelectedCell(position);
    dragStartValue.current = value;
    setFillRange({
      start: position,
      end: position
    });
    
    // Definir cursor para todo o documento
    document.body.style.cursor = 'crosshair';
    document.body.style.userSelect = 'none';
  }, []);

  const updateDragRange = useCallback((endPosition: CellPosition) => {
    if (!selectedCell || !isDragging) return;
    
    // Verificar se estamos na mesma seção e categoria (para arraste horizontal)
    if (endPosition.section !== selectedCell.section || 
        endPosition.categoryId !== selectedCell.categoryId) return;
    
    console.log('Updating drag range to:', endPosition);
    
    setFillRange({
      start: selectedCell,
      end: endPosition
    });
  }, [selectedCell, isDragging]);

  const endDrag = useCallback(() => {
    console.log('Drag ended, range:', fillRange);
    setIsDragging(false);
    
    // Restaurar cursor
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    const range = fillRange;
    
    // Limpar range após um delay para feedback visual
    setTimeout(() => {
      setFillRange(null);
    }, 300);
    
    return range;
  }, [fillRange]);

  const clearSelection = useCallback(() => {
    console.log('Selection cleared');
    setSelectedCell(null);
    setFillRange(null);
    setIsDragging(false);
    dragStartValue.current = 0;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const getCellsInRange = useCallback((range: FillRange): CellPosition[] => {
    const cells: CellPosition[] = [];
    const { start, end } = range;
    
    console.log('Getting cells in range:', start, end);
    
    // Determinar direção do preenchimento (horizontal apenas)
    const minMonth = Math.min(start.monthIndex, end.monthIndex);
    const maxMonth = Math.max(start.monthIndex, end.monthIndex);
    
    // Preenchimento horizontal (mesma categoria, diferentes meses)
    if (start.categoryId === end.categoryId && start.section === end.section) {
      for (let month = minMonth; month <= maxMonth; month++) {
        cells.push({
          categoryId: start.categoryId,
          monthIndex: month,
          section: start.section
        });
      }
    }
    
    console.log('Cells in range:', cells);
    return cells;
  }, []);

  const isInFillRange = useCallback((position: CellPosition): boolean => {
    if (!fillRange || !isDragging) return false;
    
    const cellsInRange = getCellsInRange(fillRange);
    const inRange = cellsInRange.some(cell => 
      cell.categoryId === position.categoryId && 
      cell.monthIndex === position.monthIndex &&
      cell.section === position.section
    );
    
    return inRange;
  }, [fillRange, isDragging, getCellsInRange]);

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
