
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;
type ResetPasswordFormValues = { email: string };

interface LoginFormProps {
  setActiveTab: (tab: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setActiveTab }) => {
  const { login, requestPasswordReset } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(z.object({
      email: z.string().email("Endereço de email inválido")
    })),
    defaultValues: {
      email: form.getValues("email") || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    try {
      setIsResettingPassword(true);
      await requestPasswordReset(values.email);
      setIsResetDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const openResetDialog = () => {
    resetPasswordForm.setValue("email", form.getValues("email") || "");
    setIsResetDialogOpen(true);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="seu@email.com" 
                    autoComplete="email"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Senha</FormLabel>
                  <button 
                    type="button" 
                    className="text-sm font-medium text-primary hover:text-primary/80"
                    onClick={(e) => {
                      e.preventDefault();
                      openResetDialog();
                    }}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    autoComplete="current-password"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <button
            type="button"
            className="font-medium text-primary hover:text-primary/80"
            onClick={() => setActiveTab("signup")}
          >
            Cadastre-se
          </button>
        </p>
      </div>

      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir Senha</DialogTitle>
            <DialogDescription>
              Informe seu e-mail e enviaremos instruções para redefinir sua senha.
            </DialogDescription>
          </DialogHeader>
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}>
              <FormField
                control={resetPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsResetDialogOpen(false)}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? "Enviando..." : "Enviar Link"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
