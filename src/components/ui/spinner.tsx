
import React from "react";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Spinner = ({ className, size = "md" }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <Loader
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className
      )}
    />
  );
};

export const LoadingSpinner = ({ 
  className, 
  message 
}: { 
  className?: string,
  message?: string 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)}>
      <Spinner size="lg" />
      {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};
