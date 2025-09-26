import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Pipette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  currentColor?: string;
}

const BRAND_COLORS = [
  '#10b981', // Verde da marca
  '#059669', // Verde escuro
  '#34d399', // Verde claro
  '#000000', // Preto
  '#ffffff', // Branco
  '#6b7280', // Cinza
  '#374151', // Cinza escuro
  '#f3f4f6', // Cinza claro
];

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#000000',
  '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#ffffff',
];

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  onColorSelect,
  currentColor = '#000000'
}) => {
  const [hexColor, setHexColor] = useState(currentColor);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    setHexColor(currentColor);
  }, [currentColor]);

  useEffect(() => {
    // Carregar cores recentes do localStorage
    const stored = localStorage.getItem('recent-colors');
    if (stored) {
      setRecentColors(JSON.parse(stored));
    }
  }, []);

  const handleColorSelect = (color: string) => {
    // Adicionar à lista de cores recentes
    const newRecent = [color, ...recentColors.filter(c => c !== color)].slice(0, 8);
    setRecentColors(newRecent);
    localStorage.setItem('recent-colors', JSON.stringify(newRecent));
    
    onColorSelect(color);
    onClose();
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) {
      value = '#' + value;
    }
    setHexColor(value);
  };

  const handleHexSubmit = () => {
    if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
      handleColorSelect(hexColor);
    }
  };

  const handleEyedropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-ignore - EyeDropper API ainda não está nos tipos
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        handleColorSelect(result.sRGBHex);
      } catch (err) {
        console.log('Eyedropper cancelled or not supported');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background border border-border rounded-lg shadow-lg p-6 w-80 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Selecionar Cor</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Cores da Marca */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Cores da Marca</Label>
          <div className="grid grid-cols-8 gap-2">
            {BRAND_COLORS.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-8 h-8 rounded border-2 transition-transform hover:scale-110",
                  currentColor === color ? "border-primary" : "border-border"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </div>

        {/* Cores Pré-definidas */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Cores Pré-definidas</Label>
          <div className="grid grid-cols-8 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-8 h-8 rounded border-2 transition-transform hover:scale-110",
                  currentColor === color ? "border-primary" : "border-border"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </div>

        {/* Cores Recentes */}
        {recentColors.length > 0 && (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Recentes</Label>
            <div className="grid grid-cols-8 gap-2">
              {recentColors.map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  className={cn(
                    "w-8 h-8 rounded border-2 transition-transform hover:scale-110",
                    currentColor === color ? "border-primary" : "border-border"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Input Hexadecimal */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Cor Personalizada</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={hexColor}
              onChange={handleHexChange}
              placeholder="#000000"
              className="flex-1"
              maxLength={7}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleHexSubmit}
              disabled={!/^#[0-9A-F]{6}$/i.test(hexColor)}
            >
              OK
            </Button>
          </div>
        </div>

        {/* Conta-gotas */}
        {'EyeDropper' in window && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={handleEyedropper}
              className="w-full"
            >
              <Pipette className="w-4 h-4 mr-2" />
              Conta-gotas
            </Button>
          </div>
        )}

        {/* Preview */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Preview:</Label>
          <div
            className="w-8 h-8 rounded border-2 border-border"
            style={{ backgroundColor: hexColor }}
          />
          <span className="text-sm text-muted-foreground">{hexColor}</span>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerModal;