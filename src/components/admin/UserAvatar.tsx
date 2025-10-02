import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAvatar } from '@/contexts/AvatarContext';
import { useProductTour } from '@/contexts/ProductTourProvider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  showSettings?: boolean;
  onLogout?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  showSettings = true, 
  onLogout 
}) => {
  const { user, logout } = useAuth();
  const { avatarUrl } = useAvatar();
  const { startTour } = useProductTour();
  const navigate = useNavigate();

  const handleTutorial = async () => {
    // Navigate to dashboard first
    navigate('/dashboard');
    // Start the product tour
    await startTour();
  };

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await logout();
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    }
  };

  const getUserInitials = () => {
    const userAny = user as any;
    if (!userAny?.user_metadata?.full_name) return 'U';
    const names = userAny.user_metadata.full_name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="User" />
            ) : (
              <AvatarFallback className="bg-gray-100 text-black">
                {getUserInitials()}
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2 text-sm font-medium">
          {(user as any)?.user_metadata?.full_name || 'Usuário'}
        </div>
        <DropdownMenuSeparator />
        {showSettings && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleTutorial} className="flex items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          Tutorial do sistema
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};