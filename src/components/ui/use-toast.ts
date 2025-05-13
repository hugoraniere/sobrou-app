
import { useToast as useToastHook, toast as toastFunction } from "@/hooks/use-toast";

// Re-exportando para manter a compatibilidade
export const useToast = useToastHook;
export const toast = toastFunction;
