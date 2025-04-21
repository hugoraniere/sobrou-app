import React, { useState, useEffect } from 'react';
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const passwordResetSchema = z.object({
  email: z.string().email("Por favor, insira um email válido"),
});

interface LoginFormProps {
  setActiveTab: (tab: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setActiveTab }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const { login } = useAuth();
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Check for verification success in URL params
  useEffect(() => {
    const verification = searchParams.get('verification');
    if (verification === 'success') {
      setVerificationSuccess(true);
    }
  }, [searchParams]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    }
  };

  const handlePasswordReset = async (values: { email: string }) => {
    try {
      setIsResettingPassword(true);
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast.success('Email de redefinição de senha enviado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar email de redefinição');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const passwordResetForm = useForm<{ email: string }>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { email: "" }
  });

  return (
    <Form {...form}>
      {verificationSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Email verified successfully! You can now log in.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="you@example.com" 
                    type="email" 
                    className="pl-10" 
                    {...field} 
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <a href="/reset-password" className="text-sm text-primary hover:underline">
                      Esqueceu a senha?
                    </a>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Redefinir Senha</DialogTitle>
                      <DialogDescription>
                        Insira seu email para receber instruções de redefinição de senha
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordResetForm}>
                      <form onSubmit={passwordResetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                        <FormField
                          control={passwordResetForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="seu@exemplo.com" 
                                    type="email" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full mt-4"
                          disabled={isResettingPassword}
                        >
                          {isResettingPassword ? 'Enviando...' : 'Enviar link de redefinição'}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...field}
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full mt-6" 
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <div className="flex justify-center mt-4">
        <p className="text-sm text-gray-600">
          Ainda não tem uma conta?{" "}
          <a
            onClick={() => setActiveTab("signup")}
            className="text-primary hover:underline cursor-pointer"
          >
            Criar agora
          </a>
        </p>
      </div>
    </Form>
  );
};

export default LoginForm;
