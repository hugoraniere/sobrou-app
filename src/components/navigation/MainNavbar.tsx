import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Plus, Settings, Shield } from 'lucide-react';
import { BlogService } from '@/services/blogService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import LogoWithAlphaBadge from '@/components/brand/LogoWithAlphaBadge';
import AddTransactionDialog from '@/components/transactions/AddTransactionDialog';
import MobileNavigation from './MobileNavigation';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { NotificationBell } from '../notifications/NotificationBell';
import { UserAvatar } from '@/components/admin/UserAvatar';
const MainNavbar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [canAccessAdmin, setCanAccessAdmin] = useState(false);
  const { isMobile } = useResponsive();

  // Check admin access when user changes
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (user) {
        try {
          const hasAccess = await BlogService.canAccessAdmin();
          setCanAccessAdmin(hasAccess);
        } catch (error) {
          setCanAccessAdmin(false);
        }
      } else {
        setCanAccessAdmin(false);
      }
    };

    checkAdminAccess();
  }, [user]);
  return <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background-base border-b border-border-subtle shadow-sm h-16">
      <div className="flex justify-between items-center h-full px-4 md:px-6">
        
        {/* Left side: Logo */}
        <div className="flex items-center space-x-3">
          <Link to={user ? "/" : "/"} className="flex items-center">
            <LogoWithAlphaBadge className="h-7" size="sm" />
          </Link>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center space-x-2">
          {!user && <Link to="/auth">
              <Button variant="default" size="sm" className="rounded-full">
                {t('auth.login', 'Entrar')}
              </Button>
            </Link>}
          
          {user && <>
              {/* Add Transaction - Both mobile and desktop */}
              

              {/* Mobile menu - positioned on the right */}
              {isMobile && <MobileNavigation />}
              
              {/* Notification Bell and User Menu */}
              <div className="flex items-center space-x-2">
                <NotificationBell className={isMobile ? 'hidden' : ''} />
                
                {/* Admin Button - Only show if user has admin access */}
                {!isMobile && canAccessAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                )}
                
                {!isMobile && <UserAvatar />}
              </div>
            </>}
        </div>
      </div>

      {/* Dialog para nova transação */}
      {user && <AddTransactionDialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen} onTransactionAdded={() => {}} />}
    </header>;
};
export default MainNavbar;