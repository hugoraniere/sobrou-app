import React from 'react';
import SobrouDashboard from '@/components/dashboard/SobrouDashboard';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

const AdminDashboard = () => {
  return (
    <AdminPageLayout title="Dashboard Administrativo" subtitle="Visão geral e métricas do sistema">
      <SobrouDashboard />
    </AdminPageLayout>
  );
};

export default AdminDashboard;