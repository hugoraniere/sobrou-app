import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BlogService } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock, Plus, List } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostForm from '@/components/blog/PostForm';
import PostsList from '@/components/blog/PostsList';

const AdminBlog: React.FC = () => {
  const { user, login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    try {
      const adminStatus = await BlogService.isAdmin();
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      await login(loginForm.email, loginForm.password, '/admin-blog');
      toast({
        message: 'Login realizado com sucesso!',
        type: 'success'
      });
    } catch (error: any) {
      toast({
        message: error.message || 'Erro ao fazer login',
        type: 'error'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Loading state
  if (isLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated - show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 justify-center">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Admin do Blog</CardTitle>
            </div>
            <CardDescription>
              Faça login com suas credenciais de administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 justify-center text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Acesso Negado</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você não tem permissões de administrador para acessar esta área.
                Entre em contato com um administrador para obter acesso.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin interface
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold">Gerenciamento do Blog</h1>
            <div className="text-sm text-muted-foreground">
              Logado como: {user?.email}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="new-post" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Post
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <PostsList />
          </TabsContent>

          <TabsContent value="new-post">
            <PostForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminBlog;