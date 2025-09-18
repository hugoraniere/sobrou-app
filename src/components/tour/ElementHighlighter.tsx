import React, { useMemo } from 'react';
import { ElementMetadata } from '@/types/anchor-picking';
import { AnchorGenerationService } from '@/services/AnchorGenerationService';

interface ElementHighlighterProps {
  element: Element;
  bbox: DOMRect;
  metadata: ElementMetadata;
  isActive?: boolean;
}

export const ElementHighlighter: React.FC<ElementHighlighterProps> = ({
  element,
  bbox,
  metadata,
  isActive = false
}) => {
  const friendlyName = useMemo(() => 
    AnchorGenerationService.generateFriendlyName(metadata),
    [metadata]
  );

  const kind = useMemo(() =>
    AnchorGenerationService.detectKind(metadata),
    [metadata]
  );

  const highlightStyle: React.CSSProperties = {
    position: 'absolute',
    top: bbox.top + window.scrollY,
    left: bbox.left + window.scrollX,
    width: bbox.width,
    height: bbox.height,
    border: isActive ? '2px solid hsl(var(--primary))' : '2px solid hsl(var(--primary) / 0.6)',
    backgroundColor: isActive ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--primary) / 0.05)',
    borderRadius: '4px',
    pointerEvents: 'none',
    zIndex: 9998,
    transition: 'all 0.2s ease-in-out'
  };

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    top: bbox.top + window.scrollY - 32,
    left: bbox.left + window.scrollX,
    backgroundColor: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
    zIndex: 9999,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  };

  // Ajustar posição do label se sair da tela
  if (bbox.top < 40) {
    labelStyle.top = bbox.top + window.scrollY + bbox.height + 8;
  }
  if (bbox.left + 300 > window.innerWidth) {
    labelStyle.left = bbox.left + window.scrollX + bbox.width - 300;
  }

  const kindBadgeStyle: React.CSSProperties = {
    backgroundColor: 'hsl(var(--primary-foreground) / 0.2)',
    color: 'hsl(var(--primary-foreground))',
    padding: '1px 4px',
    borderRadius: '2px',
    fontSize: '10px',
    fontWeight: '400',
    marginLeft: '4px',
    textTransform: 'uppercase'
  };

  return (
    <>
      {/* Highlight border */}
      <div style={highlightStyle} />
      
      {/* Label with element info */}
      <div style={labelStyle}>
        {friendlyName}
        <span style={kindBadgeStyle}>{kind}</span>
      </div>
      
      {/* Cursor indicator */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: bbox.top + window.scrollY + bbox.height / 2 - 12,
            left: bbox.left + window.scrollX + bbox.width / 2 - 12,
            width: '24px',
            height: '24px',
            backgroundColor: 'hsl(var(--primary))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 9999,
            animation: 'pulse 2s infinite'
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'hsl(var(--primary-foreground))',
              borderRadius: '50%'
            }}
          />
        </div>
      )}
    </>
  );
};