import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Mail, Calendar, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  subscription_status?: string;
  subscription_expires_at?: string;
}

interface PlanUsersModalProps {
  plan: Plan | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlanUsersModal: React.FC<PlanUsersModalProps> = ({
  plan,
  isOpen,
  onClose
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0
  });

  useEffect(() => {
    if (isOpen && plan) {
      fetchPlanUsers();
    }
  }, [isOpen, plan]);

  const fetchPlanUsers = async () => {
    if (!plan) return;

    setIsLoading(true);
    try {
      // Fetch users with this plan from subscriptions table
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          user_id,
          status,
          expires_at,
          created_at
        `)
        .eq('plan', plan.name.toLowerCase());

      if (subError) throw subError;

      if (!subscriptions || subscriptions.length === 0) {
        setUsers([]);
        setStats({ total: 0, active: 0, expired: 0 });
        setIsLoading(false);
        return;
      }

      // Get user details
      const userIds = subscriptions.map(sub => sub.user_id);
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      // Note: auth.admin.listUsers() is not available in client-side code
      // We'll work with profiles and create mock auth data
      
      // Combine data
      const usersData: User[] = subscriptions.map(sub => {
        const profile = profiles?.find(p => p.id === sub.user_id);
        
        return {
          id: sub.user_id,
          email: `usuário-${sub.user_id.slice(0, 8)}@email.com`, // Mock email since we can't access auth from client
          full_name: profile?.full_name,
          created_at: sub.created_at,
          subscription_status: sub.status,
          subscription_expires_at: sub.expires_at
        };
      });

      setUsers(usersData);

      // Calculate stats
      const now = new Date();
      const activeCount = usersData.filter(user => 
        user.subscription_status === 'active' && 
        (!user.subscription_expires_at || new Date(user.subscription_expires_at) > now)
      ).length;
      
      const expiredCount = usersData.filter(user => 
        user.subscription_status !== 'active' || 
        (user.subscription_expires_at && new Date(user.subscription_expires_at) <= now)
      ).length;

      setStats({
        total: usersData.length,
        active: activeCount,
        expired: expiredCount
      });

    } catch (error) {
      console.error('Error fetching plan users:', error);
      toast.error("Falha ao carregar usuários do plano");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getUserStatus = (user: User) => {
    if (!user.subscription_expires_at) return 'Ativo';
    
    const now = new Date();
    const expiresAt = new Date(user.subscription_expires_at);
    
    if (user.subscription_status === 'active' && expiresAt > now) {
      return 'Ativo';
    } else if (expiresAt <= now) {
      return 'Expirado';
    } else {
      return user.subscription_status || 'Inativo';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Ativo': return 'default';
      case 'Expirado': return 'destructive';
      default: return 'secondary';
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários do Plano: {plan.name}
          </DialogTitle>
          <DialogDescription>
            Visualize todos os usuários que possuem este plano
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
                <Crown className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiradas/Inativas</CardTitle>
                <Calendar className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Users List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário com este plano'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
              </p>
              
              <div className="grid gap-3">
                {filteredUsers.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{user.email}</span>
                            {user.full_name && (
                              <span className="text-sm text-muted-foreground">({user.full_name})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Assinatura desde: {formatDate(user.created_at)}
                            </span>
                            {user.subscription_expires_at && (
                              <span className="text-xs text-muted-foreground">
                                Expira em: {formatDate(user.subscription_expires_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant={getStatusBadgeVariant(getUserStatus(user))}>
                        {getUserStatus(user)}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanUsersModal;