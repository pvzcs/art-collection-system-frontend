'use client';

import { useState } from 'react';
import { Toaster } from "sonner";
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SettingsDialog } from '@/components/shared';
import { useAuthStore } from '@/lib/stores/authStore';
import { logout as logoutApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { clearAuth, isAdmin } = useAuthStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi();
      clearAuth();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      // Even if API call fails, clear local auth
      clearAuth();
      router.push('/login');
    }
  };

  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <Header onLogout={handleLogout} onOpenSettings={handleOpenSettings} />

      <div className="flex flex-1">
        <Sidebar isAdmin={isAdmin} />

        <main id="main-content" className="flex-1 overflow-auto" role="main">
          <div className="container mx-auto p-4 lg:p-6 pb-20 lg:pb-6">
            {children}
          </div>
        </main>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <Toaster
        position="top-right"
        duration={3000}
      />
    </div>
  );
}
