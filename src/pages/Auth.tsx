
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();

  // Check for verification parameter in URL
  useEffect(() => {
    const verification = searchParams.get('verification');
    if (verification === 'success') {
      setActiveTab('login');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sobrou</h1>
            <p className="text-gray-600 mt-2">Seu assistente financeiro pessoal</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login na Sobrou</CardTitle>
                  <CardDescription>
                    Bem-vindo de volta! Vamos verificar suas finanças.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm setActiveTab={setActiveTab} />
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
    </div>
  );
};

export default Auth;
