'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Users, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarProps {
  isAdmin: boolean;
}

const adminNavItems = [
  {
    title: 'Activities',
    href: '/admin/activities',
    icon: LayoutDashboard,
  },
  {
    title: 'Review Queue',
    href: '/admin/review-queue',
    icon: CheckSquare,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
];

export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r bg-background transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
        aria-label="Admin navigation sidebar"
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn('ml-auto', collapsed && 'mx-auto')}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </Button>
        </div>

        <nav className="flex-1 p-2 space-y-1" aria-label="Admin navigation menu">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors min-h-[44px]',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.title : undefined}
                aria-label={item.title}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar - Shown as bottom navigation on admin pages */}
      {pathname.startsWith('/admin') && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background" aria-label="Admin navigation menu">
          <div className="flex items-center justify-around p-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors min-w-[70px] min-h-[44px]',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-label={item.title}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={cn('h-5 w-5', active && 'fill-primary/20')} aria-hidden="true" />
                  <span className="truncate max-w-full">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
