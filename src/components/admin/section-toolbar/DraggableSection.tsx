import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSectionManagement } from '@/contexts/SectionManagementContext';
import type { LandingSection } from '@/contexts/SectionManagementContext';
import { toast } from 'sonner';

interface DraggableSectionProps {
  section: LandingSection;
  index: number;
  onEdit: () => void;
  isLoading: boolean;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  onEdit,
  isLoading
}) => {
  const { toggleSectionVisibility } = useSectionManagement();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleSectionVisibility(section.id);
      toast(`Seção ${section.isVisible ? 'ocultada' : 'exibida'} com sucesso!`);
    } catch (error) {
      toast("Erro ao alterar visibilidade da seção");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-background border rounded-lg p-3 flex items-center gap-2 group transition-all",
        isDragging && "shadow-lg opacity-50",
        !section.isVisible && "opacity-60"
      )}
      {...attributes}
    >
      {/* Drag Handle */}
      <button
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
        title="Arrastar para reordenar"
      >
        <GripVertical className="w-3 h-3" />
      </button>

      {/* Section Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs font-mono">
            #{index + 1}
          </Badge>
          <span className="text-xs text-muted-foreground truncate">
            {section.component}
          </span>
        </div>
        <div className="text-sm font-medium truncate">
          {section.displayName}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          className="w-6 h-6"
          title="Renomear seção"
          disabled={isLoading}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleVisibility}
          className="w-6 h-6"
          title={section.isVisible ? "Ocultar seção" : "Exibir seção"}
          disabled={isLoading}
        >
          {section.isVisible ? (
            <Eye className="w-3 h-3" />
          ) : (
            <EyeOff className="w-3 h-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default DraggableSection;