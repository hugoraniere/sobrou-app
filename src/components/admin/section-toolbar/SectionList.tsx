import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useSectionManagement } from '@/contexts/SectionManagementContext';
import DraggableSection from './DraggableSection';
import SectionRenameModal from './SectionRenameModal';
import type { LandingSection } from '@/contexts/SectionManagementContext';
import { toast } from 'sonner';

const SectionList: React.FC = () => {
  const { sections, loading, updateSectionOrder } = useSectionManagement();
  const [localSections, setLocalSections] = useState<LandingSection[]>(sections);
  const [editingSection, setEditingSection] = useState<LandingSection | null>(null);

  React.useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localSections.findIndex(section => section.id === active.id);
      const newIndex = localSections.findIndex(section => section.id === over.id);
      
      const newSections = arrayMove(localSections, oldIndex, newIndex).map((section, index) => ({
        ...section,
        order: index
      }));

      setLocalSections(newSections);
      
      try {
        await updateSectionOrder(newSections);
        toast("Ordem das seções atualizada com sucesso!");
      } catch (error) {
        toast("Erro ao atualizar ordem das seções");
        // Revert on error
        setLocalSections(sections);
      }
    }
  };

  const sortedSections = [...localSections].sort((a, b) => a.order - b.order);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={sortedSections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortedSections.map((section, index) => (
              <DraggableSection
                key={section.id}
                section={section}
                index={index}
                onEdit={() => setEditingSection(section)}
                isLoading={loading}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <SectionRenameModal
        section={editingSection}
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
      />
    </>
  );
};

export default SectionList;