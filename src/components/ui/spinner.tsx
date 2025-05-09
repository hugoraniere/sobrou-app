
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader, AlertCircle } from "lucide-react";

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

interface LoadingSpinnerProps {
  className?: string;
  message?: string;
  timeout?: number; // Tempo em ms após o qual mostramos uma mensagem adicional
  errorMessage?: string; // Mensagem de erro opcional
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className, 
  message = "Carregando...",
  timeout = 10000, // 10 segundos por padrão
  errorMessage
}) => {
  const [isLongWait, setIsLongWait] = useState(false);
  const [isVeryLongWait, setIsVeryLongWait] = useState(false);

  useEffect(() => {
    // Se o componente permanecer montado por mais tempo que o timeout,
    // indicamos que a espera está sendo longa
    const longWaitTimer = setTimeout(() => {
      setIsLongWait(true);
    }, timeout);

    // Se continuar esperando por mais tempo, mostrar mensagem adicional
    const veryLongWaitTimer = setTimeout(() => {
      setIsVeryLongWait(true);
    }, timeout * 2); // Dobro do timeout inicial

    return () => {
      clearTimeout(longWaitTimer);
      clearTimeout(veryLongWaitTimer);
    };
  }, [timeout]);

  // Se há uma mensagem de erro explícita, mostrar em vez do spinner
  if (errorMessage) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8", className)}>
        <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
        <p className="text-sm text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)}>
      <Spinner size="lg" />
      {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
      
      {isLongWait && (
        <div className="mt-4 flex items-center gap-2 text-amber-500 text-xs">
          <AlertCircle className="h-4 w-4" />
          <p>Isso está demorando mais que o esperado. Por favor, aguarde mais um pouco.</p>
        </div>
      )}

      {isVeryLongWait && (
        <div className="mt-2 flex flex-col items-center gap-2 text-red-500 text-xs">
          <p>Tempo de espera muito longo. Tente atualizar a página.</p>
        </div>
      )}
    </div>
  );
};
