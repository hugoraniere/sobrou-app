import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline,
  Palette,
  Type,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormattingToolbarProps {
  selection: Selection;
  onApplyFormatting: (command: string, value?: string) => void;
  onClose: () => void;
}

const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  selection,
  onApplyFormatting,
  onClose
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#000000', '#4A5568', '#718096', '#A0AEC0',
    '#2D3748', '#1A202C', '#E53E3E', '#DD6B20',
    '#D69E2E', '#38A169', '#00B5D8', '#3182CE',
    '#805AD5', '#D53F8C'
  ];

  const fontSizes = [
    { label: 'Pequena', value: '1' },
    { label: 'Normal', value: '3' },
    { label: 'Grande', value: '5' },
    { label: 'Maior', value: '7' }
  ];

  useEffect(() => {
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setPosition({
        top: rect.top - 60,
        left: rect.left + (rect.width / 2) - 150
      });
    }
  }, [selection]);

  const handleColorChange = (color: string) => {
    onApplyFormatting('foreColor', color);
    setShowColorPicker(false);
  };

  const handleFontSizeChange = (size: string) => {
    onApplyFormatting('fontSize', size);
  };

  return (
    <>
      <div
        ref={toolbarRef}
        className="fixed z-50 bg-card border border-border rounded-lg shadow-lg p-2 flex items-center gap-1"
        style={{ 
          top: `${position.top}px`, 
          left: `${position.left}px`,
          minWidth: '300px'
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onApplyFormatting('bold')}
          className="p-2"
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onApplyFormatting('italic')}
          className="p-2"
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onApplyFormatting('underline')}
          className="p-2"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2"
          >
            <Palette className="w-4 h-4" />
          </Button>
          
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-3 grid grid-cols-7 gap-1 min-w-[200px]">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          )}
        </div>

        <select
          className="text-sm bg-background border border-border rounded px-2 py-1"
          onChange={(e) => handleFontSizeChange(e.target.value)}
          defaultValue="3"
        >
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default FormattingToolbar;