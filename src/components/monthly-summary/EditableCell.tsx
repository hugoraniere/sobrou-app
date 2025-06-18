
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrencyInput, parseCurrencyToNumber, formatCurrencyForDisplay } from '@/utils/currencyUtils';
import { cn } from '@/lib/utils';
import { CellPosition } from '@/hooks/useDragFill';

interface EditableCellProps {
  value: number;
  onChange: (value: number) => void;
  position: CellPosition;
  isSelected?: boolean;
  isInFillRange?: boolean;
  onCellSelect?: (position: CellPosition, value: number) => void;
  onDragStart?: (position: CellPosition, value: number) => void;
  onDragMove?: (position: CellPosition) => void;
  onDragEnd?: () => void;
  className?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  position,
  isSelected = false,
  isInFillRange = false,
  onCellSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isDragHandleHover, setIsDragHandleHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing) {
      setInputValue(value === 0 ? '' : value.toString().replace('.', ','));
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [isEditing, value]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      onCellSelect?.(position, value);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    const numericValue = parseCurrencyToNumber(inputValue);
    onChange(numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value === 0 ? '' : value.toString().replace('.', ','));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setInputValue(formatted);
  };

  const handleFillHandleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Fill handle mouse down, starting drag with value:', value);
    onDragStart?.(position, value);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Encontrar a célula sob o cursor
      const elementUnderCursor = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
      const cellElement = elementUnderCursor?.closest('[data-cell-position]');
      
      if (cellElement) {
        const positionData = cellElement.getAttribute('data-cell-position');
        if (positionData) {
          try {
            const targetPosition = JSON.parse(positionData);
            onDragMove?.(targetPosition);
          } catch (error) {
            console.error('Error parsing cell position:', error);
          }
        }
      }
    };

    const handleMouseUp = () => {
      console.log('Fill handle mouse up');
      onDragEnd?.();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setIsDragHandleHover(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleCellMouseEnter = () => {
    if (onDragMove) {
      onDragMove(position);
    }
  };

  if (isEditing) {
    return (
      <div
        ref={cellRef}
        data-cell-position={JSON.stringify(position)}
        className={cn("relative", className)}
        onMouseEnter={handleCellMouseEnter}
      >
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-center text-xs h-4 px-1 border-0 shadow-none focus:ring-1 focus:ring-blue-400"
          placeholder="0,00"
        />
      </div>
    );
  }

  return (
    <div
      ref={cellRef}
      data-cell-position={JSON.stringify(position)}
      onClick={handleClick}
      onMouseEnter={handleCellMouseEnter}
      className={cn(
        "relative text-center text-xs cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded transition-colors min-h-[18px] flex items-center justify-center",
        isSelected && "ring-2 ring-blue-500 bg-blue-50",
        isInFillRange && "bg-blue-200 ring-1 ring-blue-400",
        className
      )}
      title="Clique para editar"
    >
      {formatCurrencyForDisplay(value)}
      
      {isSelected && !isEditing && (
        <div
          onMouseDown={handleFillHandleMouseDown}
          onMouseEnter={() => setIsDragHandleHover(true)}
          onMouseLeave={() => setIsDragHandleHover(false)}
          className={cn(
            "absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 border-2 border-white shadow-lg transition-all duration-150 cursor-crosshair hover:scale-110",
            isDragHandleHover ? "bg-blue-700" : ""
          )}
          style={{ 
            borderRadius: '50%'
          }}
          title="Arraste para preencher células adjacentes"
        />
      )}
    </div>
  );
};
