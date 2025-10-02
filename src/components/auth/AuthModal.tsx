import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    } else if (tab === 'login') {
      setActiveTab('login');
    }
  }, [searchParams]);

  const handleClose = () => {
    // Remove auth params from URL when closing
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('auth');
    newParams.delete('tab');
    setSearchParams(newParams);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar conta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Entrar na sua conta</CardTitle>
                <CardDescription>
                  Bem-vindo de volta! Vamos verificar suas finanças.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <LoginForm 
                  setActiveTab={setActiveTab} 
                  redirectTo={searchParams.get('redirect') ? decodeURIComponent(searchParams.get('redirect')!) : undefined}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Crie sua conta gratuita</CardTitle>
                <CardDescription>
                  Comece a organizar suas despesas com apenas algumas mensagens.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <SignupForm setActiveTab={setActiveTab} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
