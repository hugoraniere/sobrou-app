import React, { useEffect } from 'react';
import { useTourDevMode } from './TourDevOverlay';

export const TourAnchorHighlighter: React.FC = () => {
  const { isDevMode } = useTourDevMode();

  useEffect(() => {
    if (!isDevMode) return;

    const highlightAnchors = () => {
      // Remove existing highlights
      document.querySelectorAll('.tour-anchor-highlight').forEach(el => {
        el.classList.remove('tour-anchor-highlight');
      });

      // Add highlights to all tour anchors
      document.querySelectorAll('[data-tour-id]').forEach(element => {
        element.classList.add('tour-anchor-highlight');
      });
    };

    // Add CSS for highlights
    const style = document.createElement('style');
    style.textContent = `
      .tour-anchor-highlight {
        outline: 2px dashed #3b82f6 !important;
        outline-offset: 2px !important;
        background: rgba(59, 130, 246, 0.05) !important;
        position: relative;
      }
      
      .tour-anchor-highlight::before {
        content: attr(data-tour-id);
        position: absolute;
        top: -20px;
        left: 0;
        background: #3b82f6;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-family: monospace;
        font-weight: bold;
        z-index: 10000;
        white-space: nowrap;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // Highlight on mount and when DOM changes
    highlightAnchors();
    
    const observer = new MutationObserver(highlightAnchors);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-tour-id']
    });

    return () => {
      observer.disconnect();
      document.head.removeChild(style);
      document.querySelectorAll('.tour-anchor-highlight').forEach(el => {
        el.classList.remove('tour-anchor-highlight');
      });
    };
  }, [isDevMode]);

  return null;
};