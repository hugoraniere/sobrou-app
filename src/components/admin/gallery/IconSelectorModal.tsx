import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { searchIcons, iconCategories, IconInfo } from '@/utils/iconLibrary';

interface IconSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIconSelect: (iconName: string) => void;
  selectedIcon?: string;
}

const IconSelectorModal: React.FC<IconSelectorModalProps> = ({
  isOpen,
  onClose,
  onIconSelect,
  selectedIcon
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredIcons = searchIcons(searchTerm, selectedCategory);

  const handleIconClick = (iconName: string) => {
    onIconSelect(iconName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Selecionar Ícone</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Busca */}
          <Input
            placeholder="Buscar ícones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          {/* Filtros de categoria */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              Todos
            </Badge>
            {Object.entries(iconCategories).map(([key, label]) => (
              <Badge
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(key)}
              >
                {label}
              </Badge>
            ))}
          </div>
          
          {/* Grid de ícones */}
          <ScrollArea className="h-96">
            <div className="grid grid-cols-8 gap-3 p-2">
              {filteredIcons.map((icon: IconInfo) => {
                const IconComponent = icon.component;
                const isSelected = selectedIcon === icon.name;
                
                return (
                  <div
                    key={icon.name}
                    className={`
                      flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                      hover:bg-muted hover:border-primary
                      ${isSelected ? 'bg-primary/10 border-primary' : 'border-border'}
                    `}
                    onClick={() => handleIconClick(icon.name)}
                    title={`${icon.name} - ${iconCategories[icon.category as keyof typeof iconCategories]}`}
                  >
                    <IconComponent className="w-6 h-6 mb-2" />
                    <span className="text-xs text-center truncate w-full">
                      {icon.name}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {filteredIcons.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum ícone encontrado
              </div>
            )}
          </ScrollArea>
          
          {/* Informações do ícone selecionado */}
          {selectedIcon && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Ícone selecionado: <strong>{selectedIcon}</strong>
              </p>
            </div>
          )}
          
          {/* Botões */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconSelectorModal;