import { Navigate, Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';

export const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen w-full">
      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Body (height minus navbar) */}
      <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
