import React from 'react';
import SobrouDashboard from '@/components/dashboard/SobrouDashboard';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background">
      <main className="w-full px-4 md:px-8 py-6 md:py-8">
        <SobrouDashboard />
      </main>
    </div>
  );
};

export default AdminDashboard;