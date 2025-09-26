import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import FormattingToolbar from './FormattingToolbar';

interface InlineEditableTextProps {
  children?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

// Debounce hook
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  children,
  value,
  onChange,
  className,
  placeholder = "Clique para editar",
  multiline = false,
  element = 'div'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [selection, setSelection] = useState<Selection | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const Element = element as any;

  // Debounced save
  const debouncedSave = useDebounce((newValue: string) => {
    if (newValue !== value) {
      onChange(newValue);
    }
  }, 500);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        handleBlur();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
          // Select all text
          const range = document.createRange();
          range.selectNodeContents(contentRef.current);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setShowToolbar(false);
    if (contentRef.current) {
      const newValue = contentRef.current.textContent || '';
      setCurrentValue(newValue);
      debouncedSave(newValue);
    }
  };

  const handleInput = () => {
    if (contentRef.current) {
      const newValue = contentRef.current.textContent || '';
      setCurrentValue(newValue);
      debouncedSave(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      handleBlur();
    }
  };

  const handleSelect = () => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && isEditing) {
      setSelection(sel);
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  const applyFormatting = (command: string, value?: string) => {
    if (command === 'foreColor') {
      // Modern approach for color
      document.execCommand(command, false, value);
    } else if (command === 'fontSize') {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false, value);
    }
    
    if (contentRef.current) {
      contentRef.current.focus();
      // Update value after formatting
      const newValue = contentRef.current.innerHTML;
      setCurrentValue(newValue);
      debouncedSave(newValue);
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <Element
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className={cn(
            'outline-none border-2 border-primary/50 rounded-md px-2 py-1 bg-background/80 backdrop-blur-sm',
            'focus:border-primary transition-colors duration-200 min-h-[2em]',
            className
          )}
          onBlur={handleBlur}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={handleSelect}
          onKeyUp={handleSelect}
          dangerouslySetInnerHTML={{ __html: currentValue }}
        />
        
        {showToolbar && selection && (
          <FormattingToolbar
            selection={selection}
            onApplyFormatting={applyFormatting}
            onClose={() => setShowToolbar(false)}
          />
        )}
      </div>
    );
  }

  return (
    <Element
      className={cn(
        'cursor-pointer hover:bg-accent/20 hover:outline hover:outline-2 hover:outline-primary/30 rounded-md transition-all duration-200',
        'relative group min-h-[2em]',
        className
      )}
      onClick={handleClick}
    >
      {currentValue || (
        <span className="text-muted-foreground italic">
          {placeholder}
        </span>
      )}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded text-nowrap">
          Clique para editar
        </div>
      </div>
    </Element>
  );
};

export default InlineEditableText;