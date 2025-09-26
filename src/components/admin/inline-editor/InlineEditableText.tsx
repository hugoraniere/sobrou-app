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

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setShowToolbar(false);
    if (contentRef.current) {
      const newValue = contentRef.current.innerHTML;
      setCurrentValue(newValue);
      debouncedSave(newValue);
    }
  }, [debouncedSave]);

  const handleInput = useCallback(() => {
    if (contentRef.current) {
      const newValue = contentRef.current.innerHTML;
      setCurrentValue(newValue);
      debouncedSave(newValue);
    }
  }, [debouncedSave]);

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

  const applyFormatting = useCallback((command: string, value?: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    
    if (command === 'foreColor') {
      // Criar um span com a cor
      const span = document.createElement('span');
      span.style.color = value || '#000000';
      
      try {
        range.surroundContents(span);
      } catch (e) {
        // Se não conseguir envolver, extrair o conteúdo
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }
    } else if (command === 'bold') {
      const strong = document.createElement('strong');
      try {
        range.surroundContents(strong);
      } catch (e) {
        const contents = range.extractContents();
        strong.appendChild(contents);
        range.insertNode(strong);
      }
    } else if (command === 'italic') {
      const em = document.createElement('em');
      try {
        range.surroundContents(em);
      } catch (e) {
        const contents = range.extractContents();
        em.appendChild(contents);
        range.insertNode(em);
      }
    } else if (command === 'underline') {
      const u = document.createElement('u');
      try {
        range.surroundContents(u);
      } catch (e) {
        const contents = range.extractContents();
        u.appendChild(contents);
        range.insertNode(u);
      }
    }
    
    // Limpar seleção
    sel.removeAllRanges();
    
    if (contentRef.current) {
      contentRef.current.focus();
      const newValue = contentRef.current.innerHTML;
      setCurrentValue(newValue);
      debouncedSave(newValue);
    }
    
    setShowToolbar(false);
  }, [debouncedSave]);

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
{currentValue ? (
        <div dangerouslySetInnerHTML={{ __html: currentValue }} />
      ) : (
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