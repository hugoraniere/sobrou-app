import React from 'react';
import LazyDashboard from '@/components/dashboard/LazyDashboard';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background-base">
      <main className="w-full px-4 md:px-8 py-6 md:py-8">
        <LazyDashboard />
      </main>
    </div>
  );
};

export default AdminDashboard;