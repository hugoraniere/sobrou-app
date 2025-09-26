import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Palette, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ColorPickerModal from './ColorPickerModal';

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
  const [showColorModal, setShowColorModal] = useState(false);
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
    setShowColorModal(false);
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

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowColorModal(true)}
          className="p-1"
          title="Cor do texto"
        >
          <Palette className="w-4 h-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <ColorPickerModal
        isOpen={showColorModal}
        onClose={() => setShowColorModal(false)}
        onColorSelect={handleColorChange}
      />
    </>
  );
};

export default FormattingToolbar;