import React from 'react';
import UserManager from '@/components/blog/UserManager';

const AdminUsers = () => {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background-base">
      <main className="w-full px-4 md:px-8 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Usuários</h1>
          <p className="text-gray-600">Gerencie usuários e suas permissões na plataforma</p>
        </div>
        
        <UserManager />
      </main>
    </div>
  );
};

export default AdminUsers;