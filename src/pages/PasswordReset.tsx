
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from '@/components/brand/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const passwordResetSchema = z.object({
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [resetType, setResetType] = useState<'token' | 'logged-in'>('token');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const form = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    // Verifica se é uma redefinição de senha com token ou um usuário logado alterando a senha
    const accessToken = searchParams.get('access_token');
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    
    if ((accessToken || tokenHash) && type === 'recovery') {
      setResetType('token');
      
      // Tentar obter o email do usuário a partir do token
      const getEmailFromSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          setUserEmail(data.session.user.email);
        }
      };
      
      getEmailFromSession();
    } else if (user) {
      setResetType('logged-in');
      setUserEmail(user.email);
    } else {
      // Se não há token de recuperação e nem usuário logado, redireciona para a autenticação
      navigate('/?auth=1');
    }
  }, [searchParams, user, navigate]);

  const handlePasswordReset = async (values: { password: string }) => {
    try {
      setIsResetting(true);
      
      if (resetType === 'token') {
        // Usando o token na URL para redefinir a senha
        const { error } = await supabase.auth.updateUser({
          password: values.password
        });

        if (error) throw error;

        // Enviar email de confirmação de redefinição de senha
        if (userEmail) {
          try {
            await supabase.functions.invoke('send-password-email', {
              body: {
                email: userEmail,
                type: 'reset'
              }
            });
          } catch (emailError) {
            console.error('Erro ao enviar email de confirmação:', emailError);
            // Não interrompe o fluxo se o email falhar
          }
        }

        toast.success('Senha redefinida com sucesso!');
        navigate('/?auth=1');
      } else {
        // Usuário logado alterando a senha
        const { error } = await supabase.auth.updateUser({
          password: values.password
        });

        if (error) throw error;

        // Enviar email de confirmação de alteração de senha
        if (userEmail) {
          try {
            await supabase.functions.invoke('send-password-email', {
              body: {
                email: userEmail,
                type: 'changed'
              }
            });
          } catch (emailError) {
            console.error('Erro ao enviar email de confirmação:', emailError);
            // Não interrompe o fluxo se o email falhar
          }
        }

        toast.success('Senha atualizada com sucesso!');
        navigate('/settings');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao redefinir senha');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {resetType === 'token' ? 'Redefinir Senha' : 'Alterar Senha'}
          </h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{resetType === 'token' ? 'Nova Senha' : 'Alterar Senha'}</CardTitle>
            <CardDescription>
              {resetType === 'token' 
                ? 'Insira sua nova senha para redefinir o acesso' 
                : 'Defina uma nova senha para sua conta'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetType === 'logged-in' && (
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Por segurança, você precisará fazer login novamente após alterar sua senha.
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePasswordReset)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isResetting}
                >
                  {isResetting ? 'Processando...' : (resetType === 'token' ? 'Redefinir Senha' : 'Atualizar Senha')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordReset;
