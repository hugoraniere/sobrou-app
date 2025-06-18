
import { useState, useCallback } from 'react';

interface DragState {
  draggedIndex: number | null;
  dragOverIndex: number | null;
  isDragging: boolean;
  section: string | null;
}

export const useCategoryDragDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    draggedIndex: null,
    dragOverIndex: null,
    isDragging: false,
    section: null
  });

  const startDrag = useCallback((index: number, section: string) => {
    setDragState({
      draggedIndex: index,
      dragOverIndex: null,
      isDragging: true,
      section
    });
  }, []);

  const dragOver = useCallback((index: number) => {
    setDragState(prev => ({
      ...prev,
      dragOverIndex: index
    }));
  }, []);

  const endDrag = useCallback(() => {
    const { draggedIndex, dragOverIndex, section } = dragState;
    
    setDragState({
      draggedIndex: null,
      dragOverIndex: null,
      isDragging: false,
      section: null
    });

    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex && section) {
      return {
        fromIndex: draggedIndex,
        toIndex: dragOverIndex,
        section
      };
    }

    return null;
  }, [dragState]);

  const cancelDrag = useCallback(() => {
    setDragState({
      draggedIndex: null,
      dragOverIndex: null,
      isDragging: false,
      section: null
    });
  }, []);

  return {
    dragState,
    startDrag,
    dragOver,
    endDrag,
    cancelDrag
  };
};
