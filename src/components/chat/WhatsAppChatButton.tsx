
import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface WhatsAppChatButtonProps {
  className?: string;
}

const WhatsAppChatButton: React.FC<WhatsAppChatButtonProps> = ({ className }) => {
  const { user } = useAuth();
  const [hasWhatsApp, setHasWhatsApp] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  // Usando variável de ambiente para o número do WhatsApp
  const WHATSAPP_PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '';

  React.useEffect(() => {
    const checkWhatsAppConnection = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('whatsapp_number')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao verificar conexão WhatsApp:', error);
          throw error;
        }

        setHasWhatsApp(!!data?.whatsapp_number);
      } catch (error) {
        console.error('Erro ao verificar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWhatsAppConnection();
  }, [user]);

  const handleClick = () => {
    if (!user) {
      toast.error('Você precisa estar logado para usar o WhatsApp');
      return;
    }

    if (hasWhatsApp) {
      // Verificação de número válido antes de abrir
      if (!WHATSAPP_PHONE_NUMBER_ID) {
        toast.error('Número do WhatsApp Business não configurado');
        return;
      }
      
      // Usar a API web do WhatsApp 
      window.open(`https://wa.me/${WHATSAPP_PHONE_NUMBER_ID}`, '_blank');
    } else {
      // Redirecionar para a página de integração usando React Router
      navigate('/whatsapp-integration');
    }
  };

  if (isLoading) return null;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full bg-green-500 text-white shadow-lg",
        "hover:bg-green-600 transition-colors duration-200",
        "flex items-center justify-center",
        className
      )}
      aria-label="WhatsApp"
    >
      <BsWhatsapp className="w-6 h-6" />
    </button>
  );
};

export default WhatsAppChatButton;
