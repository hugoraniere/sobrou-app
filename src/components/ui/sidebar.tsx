
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sidebarVariants = cva(
  "border-r bg-background flex flex-col h-screen",
  {
    variants: {
      variant: {
        default: "w-64",
        narrow: "w-16",
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
  ({ className, variant, active, icon, children, ...props }, ref) => (
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
      {variant !== "narrow" && <div>{children}</div>}
    </div>
  )
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
  SidebarSectionTitle
}
