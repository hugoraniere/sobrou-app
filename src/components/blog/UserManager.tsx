import React, { useState, useEffect } from 'react';
import { BlogService } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, UserX, Shield, Edit3 } from 'lucide-react';
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
        type: 'success'
      });

      // Refresh user list
      await searchUsers();
    } catch (error: any) {
      console.error('Error managing user role:', error);
      toast({
        message: error.message || 'Erro ao alterar permissões do usuário',
        type: 'error'
      });
    } finally {
      setManagingUser(null);
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
                  <div className="space-y-1">
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
    </div>
  );
};

export default UserManager;