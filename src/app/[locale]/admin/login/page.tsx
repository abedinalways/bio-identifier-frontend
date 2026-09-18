'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useLoginMutation } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        }),
      );
      router.push(`/${locale}/admin`);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(
        err?.data?.message ||
          err?.message ||
          'Invalid credentials. Please check your email and password.',
      );
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@bio-identifier.org');
    setPassword('AdminPassword2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-bg-surface p-8 sm:p-10 rounded-3xl border border-border-subtle shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary mb-2 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Admin Access Portal
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Sign in to manage biological specimens, emergency antivenom
            hospitals, and clinical SOS dispatches.
          </p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Demo Credentials
            </span>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="font-bold text-brand-primary hover:underline cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
          <p className="text-text-secondary">
            Email:{' '}
            <code className="bg-bg-canvas px-1.5 py-0.5 rounded font-mono">
              admin@bio-identifier.org
            </code>
            <br />
            Password:{' '}
            <code className="bg-bg-canvas px-1.5 py-0.5 rounded font-mono">
              AdminPassword2026!
            </code>
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400 border border-danger-200 dark:border-danger-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@bio-identifier.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
