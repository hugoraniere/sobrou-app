import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import Logo from '../components/brand/Logo';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const navigate = useNavigate();
  const {
    user,
    isLoading
  } = useAuth();
  const [searchParams] = useSearchParams();

  // Fast redirect for Google OAuth success
  useEffect(() => {
    const successGoogle = searchParams.get('success');
    if (successGoogle === 'google' && user && !isLoading) {
      console.log('[Auth] Google OAuth success - redirecting immediately');
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, searchParams, navigate]);

  // Check for verification parameter in URL
  useEffect(() => {
    const verification = searchParams.get('verification');
    if (verification === 'success') {
      setActiveTab('login');
      toast.success('Email verificado com sucesso! Você já pode fazer login.', {
        duration: 5000
      });
    }

    // Check for tab parameter in URL
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    } else if (tab === 'login') {
      setActiveTab('login');
    }
  }, [searchParams]);
  useEffect(() => {
    if (!isLoading && user) {
      const redirectTo = searchParams.get('redirect');
      if (redirectTo) {
        navigate(decodeURIComponent(redirectTo));
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate, searchParams]);
  return <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="flex justify-center mb-4 hover:opacity-80 transition-opacity">
              <Logo size="lg" />
            </Link>
            <p className="text-gray-600 mt-2">Seu assistente financeiro pessoal</p>
          </div>
          
          {searchParams.get('verification') === 'success' && <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle>Email verificado!</AlertTitle>
              <AlertDescription>
                Sua conta foi verificada com sucesso. Agora você pode fazer login.
              </AlertDescription>
            </Alert>}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Entrar na sua conta</CardTitle>
                  <CardDescription>
                    Bem-vindo de volta! Vamos verificar suas finanças.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm 
                    setActiveTab={setActiveTab} 
                    redirectTo={searchParams.get('redirect') ? decodeURIComponent(searchParams.get('redirect')!) : undefined}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Crie sua conta gratuita</CardTitle>
                  <CardDescription>
                    Comece a organizar suas despesas com apenas algumas mensagens.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignupForm setActiveTab={setActiveTab} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};
export default Auth;