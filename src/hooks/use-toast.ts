
import { toast } from 'sonner';

type ToastProps = {
  message: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

export const useToast = () => {
  const showToast = ({ message, type = 'default', duration = 5000 }: ToastProps) => {
    switch (type) {
      case 'success':
        toast.success(message, { duration });
        break;
      case 'error':
        toast.error(message, { duration });
        break;
      case 'warning':
        toast.warning(message, { duration });
        break;
      case 'info':
        toast.info(message, { duration });
        break;
      default:
        toast(message, { duration });
    }
  };

  return { toast: showToast };
};

export { toast };
