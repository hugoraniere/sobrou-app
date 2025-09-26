import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { COMPONENT_TOKENS } from '@/constants/componentTokens';

const editorButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-dark shadow-sm hover:shadow-md',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 hover:border-gray-300',
        outline: 'border border-primary text-primary bg-transparent hover:bg-primary-light',
        ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md',
        toolbar: 'bg-white/90 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 backdrop-blur-sm shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 text-sm rounded-md',
        base: 'h-10 px-4 text-base rounded-lg',
        lg: 'h-11 px-6 text-lg rounded-lg',
        icon: 'h-9 w-9 rounded-md',
        'icon-sm': 'h-8 w-8 rounded-sm',
        'icon-lg': 'h-12 w-12 rounded-lg',
      },
      state: {
        default: '',
        active: 'bg-primary text-white shadow-sm',
        loading: 'pointer-events-none',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base',
      state: 'default',
    },
  }
);

export interface EditorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof editorButtonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const EditorButton = React.forwardRef<HTMLButtonElement, EditorButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    state, 
    isLoading = false, 
    icon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const currentState = isLoading ? 'loading' : state;
    
    return (
      <button
        className={cn(editorButtonVariants({ variant, size, state: currentState, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        
        {/* Icon */}
        {!isLoading && icon && (
          <span className="flex items-center justify-center">
            {icon}
          </span>
        )}
        
        {/* Children */}
        {children && (
          <span>{children}</span>
        )}
      </button>
    );
  }
);

EditorButton.displayName = 'EditorButton';

export { EditorButton, editorButtonVariants };