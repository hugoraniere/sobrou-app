import React, { useState, useEffect } from 'react';
import { BlogService } from '@/services/blogService';
import { AdminAnalyticsService, DetailedUserStats } from '@/services/adminAnalyticsService';
import UserMetricsBigNumbers from '@/components/dashboard/UserMetricsBigNumbers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, UserX, Shield, Edit3, Eye, FileText, MessageCircle, TrendingUp, ArrowUpDown, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: string[];
  last_access?: string;
}

const UserManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [isLoading, setIsLoading] = useState(false);
  const [managingUser, setManagingUser] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedUserStats | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      const results = await BlogService.searchUsers(searchTerm, roleFilter, sortBy, sortOrder);
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
      const [blogStatsData, detailedStatsData] = await Promise.all([
        BlogService.getUserBlogStats(user.id),
        AdminAnalyticsService.getDetailedUserStats(user.id)
      ]);
      setUserStats(blogStatsData);
      setDetailedStats(detailedStatsData);
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
  }, [roleFilter, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      {/* User Metrics */}
      <UserMetricsBigNumbers />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input
              placeholder="Buscar por email ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              className="md:col-span-2"
            />
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="standard">Usuário Padrão</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={searchUsers} disabled={isLoading}>
              {isLoading ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              Buscar
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Data de Cadastro</SelectItem>
                <SelectItem value="last_access">Último Acesso</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="full_name">Nome</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === 'ASC' ? 'Crescente' : 'Decrescente'}
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        Cadastrado: {format(new Date(user.created_at), 'dd/MM/yyyy')}
                      </span>
                      {user.last_access && (
                        <span className="ml-4">
                          Último acesso: {format(new Date(user.last_access), 'dd/MM/yyyy HH:mm')}
                        </span>
                      )}
                      {!user.last_access && (
                        <span className="ml-4 text-muted-foreground/70">
                          Último acesso: Nunca
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {user.roles.length === 0 ? (
                        <Badge variant="outline">Usuário Padrão</Badge>
                      ) : (
                        user.roles.map((role) => (
                          <Badge 
                            key={role} 
                            variant={getRoleBadgeVariant(role) as any}
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
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detalhes do Usuário: {selectedUser?.full_name || selectedUser?.email}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Visão Geral do Usuário</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Email:</span> {selectedUser.email}
                    </div>
                    <div>
                      <span className="font-medium">Nome:</span> {selectedUser.full_name || 'Não informado'}
                    </div>
                    <div>
                      <span className="font-medium">Data de Cadastro:</span> {' '}
                      {detailedStats?.join_date ? new Date(detailedStats.join_date).toLocaleDateString('pt-BR') : 'Não disponível'}
                    </div>
                    <div>
                      <span className="font-medium">Último Acesso:</span> {' '}
                      {detailedStats?.last_access ? new Date(detailedStats.last_access).toLocaleDateString('pt-BR') : 'Nunca'}
                    </div>
                    <div>
                      <span className="font-medium">Roles:</span> {' '}
                      {selectedUser.roles?.length > 0 ? selectedUser.roles.join(', ') : 'Nenhuma'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Atividade de Uso do Site</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : detailedStats ? (
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Visualizações de Conteúdo:</span> {detailedStats.content_views}
                        </div>
                        <div>
                          <span className="font-medium">Receitas Salvas:</span> {detailedStats.saved_dishes}
                        </div>
                        <div>
                          <span className="font-medium">Listas de Compras:</span> {detailedStats.shopping_lists_count}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Erro ao carregar estatísticas</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Content Contribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Contribuição de Conteúdo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : detailedStats ? (
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Posts Criados:</span> {detailedStats.posts_created}
                        </div>
                        <div>
                          <span className="font-medium">Total de Visualizações:</span> {detailedStats.total_post_views}
                        </div>
                        <div>
                          <span className="font-medium">Total de Comentários:</span> {detailedStats.total_post_comments}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Erro ao carregar estatísticas</p>
                    )}
                  </CardContent>
                </Card>

                {/* Blog Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Estatísticas Detalhadas do Blog</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : userStats ? (
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Posts Publicados:</span> {userStats.total_posts}
                        </div>
                        <div>
                          <span className="font-medium">Views Únicos:</span> {userStats.total_views}
                        </div>
                        <div>
                          <span className="font-medium">Média de Views por Post:</span> {userStats.avg_views_per_post}
                        </div>
                        <div>
                          <span className="font-medium">Comentários Recebidos:</span> {userStats.total_comments}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Erro ao carregar estatísticas do blog</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Role Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Gerenciar Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(selectedUser.id, 'admin', 
                        selectedUser.roles?.includes('admin') ? 'remove' : 'add')}
                      disabled={managingUser === selectedUser.id}
                    >
                      {selectedUser.roles?.includes('admin') ? 'Remover Admin' : 'Tornar Admin'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(selectedUser.id, 'editor', 
                        selectedUser.roles?.includes('editor') ? 'remove' : 'add')}
                      disabled={managingUser === selectedUser.id}
                    >
                      {selectedUser.roles?.includes('editor') ? 'Remover Editor' : 'Tornar Editor'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManager;