
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"

// Create context for sidebar state management
type SidebarState = 'expanded' | 'collapsed';
interface SidebarContextValue {
  state: SidebarState;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ 
  children, 
  defaultOpen = true 
}: SidebarProviderProps) {
  const [state, setState] = React.useState<SidebarState>(
    defaultOpen ? 'expanded' : 'collapsed'
  );

  const toggleSidebar = React.useCallback(() => {
    setState(prev => prev === 'expanded' ? 'collapsed' : 'expanded');
  }, []);

  return (
    <SidebarContext.Provider value={{ state, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

const sidebarVariants = cva(
  "border-r bg-background flex flex-col h-screen",
  {
    variants: {
      variant: {
        default: "w-64",
        narrow: "w-16",
        sidebar: "w-64", // Add sidebar variant for backward compatibility
      },
      position: {
        left: "left-0",
        right: "right-0 border-l border-r-0",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "left",
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  position?: "left" | "right"
  className?: string
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, position, variant, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        sidebarVariants({
          position,
          variant,
          className,
        })
      )}
      {...props}
    />
  )
)

Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-b flex items-center", className)}
    {...props}
  />
))

SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 flex-1 overflow-auto", className)}
    {...props}
  />
))

SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-t mt-auto", className)}
    {...props}
  />
))

SidebarFooter.displayName = "SidebarFooter"

// Add SidebarGroup component
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4", className)}
    {...props}
  />
))

SidebarGroup.displayName = "SidebarGroup"

// Add SidebarGroupContent component
const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
))

SidebarGroupContent.displayName = "SidebarGroupContent"

// Add SidebarTrigger component
interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();
    
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring",
          className
        )}
        onClick={toggleSidebar}
        {...props}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle sidebar</span>
      </button>
    );
  }
);

SidebarTrigger.displayName = "SidebarTrigger";

// Menu components
const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
))

SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("list-none", className)}
    {...props}
  />
))

SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  asChild?: boolean;
  tooltip?: string;
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, asChild, children, tooltip, ...props }, ref) => {
    const baseClasses = cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative",
      isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      className
    );
    
    if (asChild && children) {
      // Use React.cloneElement instead of Fragment for asChild
      const child = React.Children.only(children) as React.ReactElement;
      return React.cloneElement(child, {
        className: cn(baseClasses, child.props.className),
        ref,
        ...props
      });
    }
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          "w-full text-left"
        )}
        {...props}
        title={tooltip}
      >
        {children}
      </button>
    );
  }
);

SidebarMenuButton.displayName = "SidebarMenuButton";

const sidebarItemVariants = cva(
  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
  {
    variants: {
      variant: {
        default:
          "hover:bg-accent hover:text-accent-foreground",
        ghost:
          "hover:bg-transparent hover:text-accent-foreground hover:underline",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
      },
      active: {
        true: "bg-accent text-accent-foreground",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
    },
  }
)

interface SidebarItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarItemVariants> {
  icon?: React.ReactNode
  active?: boolean
  className?: string
}

const SidebarItem = React.forwardRef<HTMLDivElement, SidebarItemProps>(
  ({ className, variant, active, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          sidebarItemVariants({
            variant,
            active,
            className,
          })
        )}
        {...props}
      >
        {icon && <div className="w-4 h-4 shrink-0">{icon}</div>}
        {children && <div>{children}</div>}
      </div>
    );
  }
)

SidebarItem.displayName = "SidebarItem"

const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4", className)}
    {...props}
  />
))

SidebarSection.displayName = "SidebarSection"

const SidebarSectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-2 px-3 text-xs text-muted-foreground font-medium", className)}
    {...props}
  />
))

SidebarSectionTitle.displayName = "SidebarSectionTitle"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
  SidebarSection,
  SidebarSectionTitle,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger
}
