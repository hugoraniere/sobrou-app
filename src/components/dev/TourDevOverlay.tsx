import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTourAnchors } from '@/utils/tour-anchors';

interface TourDevOverlayProps {
  enabled: boolean;
}

export const TourDevOverlay: React.FC<TourDevOverlayProps> = ({ enabled }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(enabled);

  // Map route paths to route keys
  const getRouteKey = (pathname: string): string => {
    if (pathname === '/dashboard' || pathname === '/') return 'dashboard';
    if (pathname.startsWith('/transactions')) return 'transactions';
    if (pathname.startsWith('/monthly-summary')) return 'monthly-summary';
    if (pathname.startsWith('/bills-to-pay')) return 'bills-to-pay';
    if (pathname.startsWith('/goals')) return 'goals';
    if (pathname.startsWith('/suporte')) return 'suporte';
    return '';
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 't' && enabled) {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !isVisible) {
      // Remove all existing overlays
      document.querySelectorAll('.tour-dev-overlay').forEach(el => el.remove());
      return;
    }

    const routeKey = getRouteKey(location.pathname);
    const anchors = getTourAnchors(routeKey);

    // Remove existing overlays
    document.querySelectorAll('.tour-dev-overlay').forEach(el => el.remove());

    // Add overlays for each anchor
    const timeout = setTimeout(() => {
      anchors.forEach(anchor => {
        const element = document.querySelector(anchor.selector);
        if (element) {
          createOverlayLabel(element, anchor.id);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.querySelectorAll('.tour-dev-overlay').forEach(el => el.remove());
    };
  }, [enabled, isVisible, location.pathname]);

  const createOverlayLabel = (element: Element, anchorId: string) => {
    const rect = element.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.className = 'tour-dev-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: ${rect.top - 25}px;
      left: ${rect.left}px;
      background: rgba(59, 130, 246, 0.9);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-family: monospace;
      font-weight: bold;
      z-index: 10000;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 1px solid rgba(59, 130, 246, 1);
    `;
    overlay.textContent = anchorId;
    document.body.appendChild(overlay);
  };

  if (!enabled) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace',
        pointerEvents: 'none'
      }}
    >
      {isVisible ? 'Tour Dev: ON (T para toggle)' : 'Tour Dev: OFF (T para toggle)'}
    </div>
  );
};

// Hook para usar o dev overlay
export const useTourDevMode = () => {
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsDevMode(urlParams.get('tour') === 'dev');
  }, []);

  return { isDevMode };
};