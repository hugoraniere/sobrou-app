
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useMediaQuery } from "@/hooks/use-mobile"

export function Toaster() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  return (
    <ToastProvider>
      <ToastViewport 
        className={
          isMobile 
            ? "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse items-center p-4"
            : "fixed bottom-0 left-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 md:max-w-[420px]"
        }
      />
    </ToastProvider>
  )
}
