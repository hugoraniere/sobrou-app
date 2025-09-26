import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { getIconComponent } from '@/utils/iconLibrary';
import IconSelectorModal from '@/components/admin/gallery/IconSelectorModal';

interface InlineEditableIconProps {
  iconName: string;
  onIconChange: (iconName: string) => void;
  className?: string;
  size?: number;
  disabled?: boolean;
}

const InlineEditableIcon: React.FC<InlineEditableIconProps> = ({
  iconName,
  onIconChange,
  className = '',
  size = 24,
  disabled = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = getIconComponent(iconName);
  const DefaultIcon = getIconComponent('HelpCircle');

  const handleIconSelect = (selectedIconName: string) => {
    onIconChange(selectedIconName);
    setIsModalOpen(false);
  };

  if (disabled) {
    return IconComponent ? (
      <IconComponent className={className} size={size} />
    ) : (
      DefaultIcon && <DefaultIcon className={className} size={size} />
    );
  }

  return (
    <>
      <div 
        className="relative inline-block group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        {IconComponent ? (
          <IconComponent className={className} size={size} />
        ) : (
          DefaultIcon && <DefaultIcon className={className} size={size} />
        )}
        
        {isHovered && (
          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="icon"
              variant="secondary"
              className="h-5 w-5 rounded-full shadow-lg"
            >
              <Pencil className="w-2.5 h-2.5" />
            </Button>
          </div>
        )}
        
        {/* Overlay para indicar que é editável */}
        <div className="absolute inset-0 bg-primary/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>

      <IconSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIconSelect={handleIconSelect}
        selectedIcon={iconName}
      />
    </>
  );
};

export default InlineEditableIcon;