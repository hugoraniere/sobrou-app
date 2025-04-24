
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionFormLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

const TransactionFormLayout: React.FC<TransactionFormLayoutProps> = ({
  title,
  description,
  children,
  footer,
  isOpen,
  setIsOpen,
  className
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn(
        "sm:max-w-[600px] p-0 gap-0 bg-white",
        "data-[state=open]:duration-300",
        "dark:bg-slate-950",
        className
      )}
      // Remover o botão de fechar padrão do Dialog
      hasCloseButton={false}
      >
        <div className="flex flex-col h-full max-h-[85vh]">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {description}
                </DialogDescription>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-6">
              {children}
            </div>
          </div>

          <DialogFooter className="p-6 pt-4 border-t">
            {footer}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormLayout;
