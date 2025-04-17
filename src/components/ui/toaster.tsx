
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
  const { toasts } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
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
