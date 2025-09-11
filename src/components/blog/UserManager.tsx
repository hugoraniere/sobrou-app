import React, { useState, useEffect } from 'react';
import { BlogService } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, UserX, Shield, Edit3, Eye, FileText, MessageCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: string[];
}

const UserManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [managingUser, setManagingUser] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      const results = await BlogService.searchUsers(searchTerm);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        message: 'Erro ao buscar usuários',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: 'admin' | 'editor', action: 'add' | 'remove') => {
    setManagingUser(userId);
    try {
      await BlogService.manageUserRole(userId, role, action);
      
      toast({
        message: `Role ${role} ${action === 'add' ? 'adicionada' : 'removida'} com sucesso`,
        type: "success",
      });

      // Refresh user list
      await searchUsers();
    } catch (error: any) {
      console.error('Error managing user role:', error);
      toast({
        message: error.message || 'Erro ao alterar permissões do usuário',
        type: "error",
      });
    } finally {
      setManagingUser(null);
    }
  };

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    setLoadingStats(true);
    
    try {
      const stats = await BlogService.getUserBlogStats(user.id);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
      toast({
        message: "Falha ao carregar estatísticas do usuário",
        type: "error",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const hasRole = (user: User, role: string) => {
    return user.roles.includes(role);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'editor':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'editor':
        return <Edit3 className="h-3 w-3" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    searchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por email ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              className="flex-1"
            />
            <Button onClick={searchUsers} disabled={isLoading}>
              {isLoading ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              Buscar
            </Button>
          </div>

          {users.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm ? 'Nenhum usuário encontrado' : 'Digite um termo para buscar usuários'}
            </p>
          )}

          <div className="space-y-3">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 cursor-pointer flex-1" onClick={() => handleUserClick(user)}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.email}</span>
                      {user.full_name && (
                        <span className="text-muted-foreground">({user.full_name})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Cadastrado em: {format(new Date(user.created_at), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {user.roles.length === 0 ? (
                        <Badge variant="outline">Usuário Padrão</Badge>
                      ) : (
                        user.roles.map((role) => (
                          <Badge 
                            key={role} 
                            variant={getRoleBadgeVariant(role)}
                            className="flex items-center gap-1"
                          >
                            {getRoleIcon(role)}
                            {role === 'admin' ? 'Administrador' : 'Editor'}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUserClick(user)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {/* Admin Role Management */}
                    {hasRole(user, 'admin') ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRoleChange(user.id, 'admin', 'remove')}
                        disabled={managingUser === user.id}
                      >
                        {managingUser === user.id ? (
                          <Spinner className="h-3 w-3" />
                        ) : (
                          <UserX className="h-3 w-3 mr-1" />
                        )}
                        Remover Admin
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChange(user.id, 'admin', 'add')}
                        disabled={managingUser === user.id}
                      >
                        {managingUser === user.id ? (
                          <Spinner className="h-3 w-3" />
                        ) : (
                          <Shield className="h-3 w-3 mr-1" />
                        )}
                        Tornar Admin
                      </Button>
                    )}

                    {/* Editor Role Management */}
                    {hasRole(user, 'editor') ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRoleChange(user.id, 'editor', 'remove')}
                        disabled={managingUser === user.id}
                      >
                        {managingUser === user.id ? (
                          <Spinner className="h-3 w-3" />
                        ) : (
                          <UserX className="h-3 w-3 mr-1" />
                        )}
                        Remover Editor
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChange(user.id, 'editor', 'add')}
                        disabled={managingUser === user.id}
                      >
                        {managingUser === user.id ? (
                          <Spinner className="h-3 w-3" />
                        ) : (
                          <Edit3 className="h-3 w-3 mr-1" />
                        )}
                        Tornar Editor
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detalhes do Usuário
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="space-y-2">
                <h3 className="font-semibold">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{selectedUser.full_name || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Criado em</p>
                    <p className="font-medium">{format(new Date(selectedUser.created_at), 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Roles</p>
                    <div className="flex gap-1">
                      {selectedUser.roles.includes('admin') && (
                        <Badge variant="destructive" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {selectedUser.roles.includes('editor') && (
                        <Badge variant="secondary" className="text-xs">
                          <Edit3 className="w-3 h-3 mr-1" />
                          Editor
                        </Badge>
                      )}
                      {selectedUser.roles.length === 0 && (
                        <span className="text-sm text-muted-foreground">Nenhuma role</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Statistics */}
              <div className="space-y-4">
                <h3 className="font-semibold">Estatísticas do Blog</h3>
                {loadingStats ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : userStats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Posts Criados</p>
                            <p className="text-xl font-bold">{userStats.total_posts}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Visualizações</p>
                            <p className="text-xl font-bold">{userStats.total_views}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Média Views/Post</p>
                            <p className="text-xl font-bold">{userStats.avg_views_per_post}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Comentários</p>
                            <p className="text-xl font-bold">{userStats.total_comments}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Erro ao carregar estatísticas
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManager;