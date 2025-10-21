'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Settings, LogOut, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/stores/authStore';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface HeaderProps {
  onLogout: () => void;
  onOpenSettings?: () => void;
}

export function Header({ onLogout, onOpenSettings }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    setMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    onLogout();
    setLogoutDialogOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 font-semibold text-lg hover:opacity-80 transition-opacity"
          aria-label={t('header.appName') + ' home'}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground" aria-hidden="true">
            <span className="text-sm font-bold">AC</span>
          </div>
          <span className="hidden sm:inline-block">{t('header.appName')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
          <Link
            href="/activities"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/activities') ? 'text-primary' : 'text-muted-foreground'
            }`}
            aria-current={isActive('/activities') ? 'page' : undefined}
          >
            {t('header.activities')}
          </Link>
          
          {user && (
            <Link
              href="/profile"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/profile') ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-current={isActive('/profile') ? 'page' : undefined}
            >
              {t('header.profile')}
            </Link>
          )}

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1" aria-label={t('header.admin') + ' menu'}>
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  {t('header.admin')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t('admin.panel')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/admin/activities')}>
                  {t('admin.manageActivities')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/admin/review-queue')}>
                  {t('admin.reviewQueue')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/admin/users')}>
                  {t('admin.manageUsers')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Desktop User Menu and Settings */}
        <div className="hidden md:flex items-center space-x-2">
          <LanguageSwitcher />
          
          {onOpenSettings && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSettings}
              aria-label={t('header.settings')}
              className="min-h-[44px] min-w-[44px]"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </Button>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 min-h-[44px]" aria-label={`User menu for ${user.nickname}`}>
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="max-w-[150px] truncate">{user.nickname}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.nickname}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('header.profile')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutClick} variant="destructive">
                  <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('header.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <LanguageSwitcher />
          
          {onOpenSettings && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onOpenSettings}
              aria-label={t('header.settings')}
              className="min-h-[44px] min-w-[44px]"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="min-h-[44px] min-w-[44px]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container px-4 py-4 space-y-3" aria-label="Mobile navigation">
            <button
              onClick={() => handleNavigation('/activities')}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                isActive('/activities')
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              aria-current={isActive('/activities') ? 'page' : undefined}
            >
              {t('header.activities')}
            </button>

            {user && (
              <button
                onClick={() => handleNavigation('/profile')}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                  isActive('/profile')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                aria-current={isActive('/profile') ? 'page' : undefined}
              >
                {t('header.profile')}
              </button>
            )}

            {isAdmin && (
              <>
                <div className="pt-2 pb-1" role="separator">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t('header.admin')}
                  </p>
                </div>
                <button
                  onClick={() => handleNavigation('/admin/activities')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    isActive('/admin/activities')
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  aria-current={isActive('/admin/activities') ? 'page' : undefined}
                >
                  {t('admin.manageActivities')}
                </button>
                <button
                  onClick={() => handleNavigation('/admin/review-queue')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    isActive('/admin/review-queue')
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  aria-current={isActive('/admin/review-queue') ? 'page' : undefined}
                >
                  {t('admin.reviewQueue')}
                </button>
                <button
                  onClick={() => handleNavigation('/admin/users')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    isActive('/admin/users')
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  aria-current={isActive('/admin/users') ? 'page' : undefined}
                >
                  {t('admin.manageUsers')}
                </button>
              </>
            )}

            {user && (
              <>
                <div className="pt-3 border-t" role="separator">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.nickname}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogoutClick}
                  className="w-full justify-start min-h-[44px]"
                  aria-label={t('header.logout')}
                >
                  <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('header.logout')}
                </Button>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('auth.logoutConfirm')}</DialogTitle>
            <DialogDescription>
              {t('auth.logoutMessage')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmLogout}
            >
              {t('header.logout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
