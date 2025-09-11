import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BlogService } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import PostsList from '@/components/blog/PostsList';
import PostForm from '@/components/blog/PostForm';
import UserManager from '@/components/blog/UserManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, LogOut, Users, FileText, Lock, AlertCircle } from 'lucide-react';

const AdminBlog = () => {
  const { user, isAuthenticated, logout, login } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const checkAdminStatus = async () => {
    if (!isAuthenticated || !user) {
      setIsAdmin(false);
      setCanAccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const [adminStatus, accessStatus] = await Promise.all([
        BlogService.isAdmin(),
        BlogService.canAccessAdmin()
      ]);
      setIsAdmin(adminStatus);
      setCanAccess(accessStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setCanAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [isAuthenticated, user]);

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

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  // Show login form if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 justify-center">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Admin do Blog</CardTitle>
            </div>
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

  // Show access denied if user is logged in but doesn't have access
  if (isAuthenticated && !canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você não tem permissões para acessar esta área.
              </AlertDescription>
            </Alert>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Logado como: {user?.email}
              </span>
              <Button variant="outline" onClick={logout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main admin interface
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              <User className="inline h-4 w-4 mr-1" />
              {user?.email}
            </span>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Gerenciador de Conteúdo
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Gerenciador de Usuários
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="content">
            <Tabs defaultValue="posts" className="space-y-4">
              <TabsList>
                <TabsTrigger value="posts">Posts Existentes</TabsTrigger>
                <TabsTrigger value="create">Criar Post</TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                <PostsList />
              </TabsContent>

              <TabsContent value="create">
                <PostForm />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users">
              <UserManager />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminBlog;