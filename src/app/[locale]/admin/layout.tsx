'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldAlert,
  Bug,
  Building2,
  PhoneCall,
  Users,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const isLoginPage = pathname?.includes('/admin/login');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isLoginPage && !isAuthenticated) {
      router.replace(`/${locale}/admin/login`);
    }
  }, [isHydrated, isLoginPage, isAuthenticated, locale, router]);

  // If on login page, just render children
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Until hydrated or if unauthenticated on protected routes, show subtle loading
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-text-muted font-medium">
            Verifying administrative access...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${locale}/admin/login`);
  };

  const navItems = [
    {
      label: 'Overview',
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Snakes & ASV',
      href: `/${locale}/admin/snakes`,
      icon: ShieldAlert,
    },
    {
      label: 'Pests & Remedies',
      href: `/${locale}/admin/pests`,
      icon: Bug,
    },
    {
      label: 'Antivenom Hospitals',
      href: `/${locale}/admin/hospitals`,
      icon: Building2,
    },
    {
      label: 'Emergency SOS Logs',
      href: `/${locale}/admin/emergency-logs`,
      icon: PhoneCall,
    },
    ...(user?.role === 'ADMIN'
      ? [
          {
            label: 'Users & Roles',
            href: `/${locale}/admin/users`,
            icon: Users,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-bg-surface border-b border-border-subtle sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black">
            BI
          </div>
          <span className="font-extrabold text-sm text-text-primary">
            Admin Console
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl text-text-primary hover:bg-bg-subtle transition"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-surface border-r border-border-subtle flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group text-text-primary hover:text-brand-primary transition"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black shadow-sm">
              BI
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight leading-tight">
                Bio-Identifier
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-brand-primary">
                Management System
              </div>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 rounded text-text-muted hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-border-subtle space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
              {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-text-primary truncate">
                {user?.name}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-success-500" />
                <span className="text-[10px] font-semibold text-text-muted uppercase">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/${locale}`}
              className="px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary bg-bg-canvas hover:bg-bg-subtle border border-border-subtle flex items-center justify-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl text-xs font-bold text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20 hover:bg-danger-100 border border-danger-200 dark:border-danger-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
