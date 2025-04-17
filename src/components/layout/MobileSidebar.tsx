
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Wallet } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import SidebarNav from './SidebarNav';

const MobileSidebar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t('common.menu', 'Menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px] max-w-[90vw] z-[1100]">
        <div className="flex items-center p-4 border-b">
          <Wallet className="h-6 w-6 text-green-500 mr-2" />
          <span className="text-xl font-bold">Sobrou</span>
        </div>
        <div className="py-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          <SidebarNav />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
