import React from 'react';
import UserManager from '@/components/blog/UserManager';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

const AdminUsers = () => {
  return (
    <AdminPageLayout 
      title="Gerenciar Usuários" 
      subtitle="Gerencie usuários e suas permissões na plataforma"
    >
      <UserManager />
    </AdminPageLayout>
  );
};

export default AdminUsers;