
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { useNavigationPages } from '@/hooks/useNavigationPages';

export function AppSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const { visiblePages } = useNavigationPages();
  const isExpanded = state === 'expanded';

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-screen z-50 bg-white shadow-lg border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      {/* Toggle button */}
      <div className="flex justify-end p-2 border-b border-gray-100">
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-2 rounded-lg hover:bg-gray-100 transition-colors",
            isExpanded && "rotate-180"
          )}
        >
          <ChevronRight className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-2">
          {visiblePages.map((item) => {
            const isActive = isActivePath(item.url);
            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center rounded-xl transition-all duration-200 group relative",
                  isExpanded ? "px-3 py-3" : "px-3 py-3 justify-center",
                  isActive 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={!isExpanded ? item.title : undefined}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isExpanded && "mr-3")} />
                {isExpanded && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.title}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings at bottom with increased spacing */}
      <div className="px-2 pb-4 border-t border-gray-100 mt-auto">
        <div className="pt-4">
          <Link
            to="/settings"
            className={cn(
              "flex items-center rounded-xl transition-all duration-200 group relative",
              isExpanded ? "px-3 py-3" : "px-3 py-3 justify-center",
              isActivePath('/settings')
                ? "bg-primary text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
            title={!isExpanded ? 'Configurações' : undefined}
          >
            <Settings className={cn("h-5 w-5 flex-shrink-0", isExpanded && "mr-3")} />
            {isExpanded && (
              <span className="font-medium text-sm whitespace-nowrap">
                Configurações
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Configurações
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
