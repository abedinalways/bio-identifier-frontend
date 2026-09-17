'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Bug,
  Activity,
  PhoneCall,
  Globe,
  Menu,
  X,
  BookOpen,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import {
  SUPPORTED_LOCALES,
  LOCALE_NAMES,
  type SupportedLocale,
} from '../../config/i18n.config';

function setLocaleCookie(newLocale: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function Navbar() {
  const { locale, t, isRtl } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    setLocaleCookie(newLocale);
    setIsLangDropdownOpen(false);

    // Replace current locale segment in pathname
    const segments = pathname.split('/');
    if (SUPPORTED_LOCALES.includes(segments[1] as SupportedLocale)) {
      segments[1] = newLocale;
      router.push(segments.join('/') || `/${newLocale}`);
    } else {
      router.push(`/${newLocale}${pathname}`);
    }
  };

  const navLinks = [
    {
      href: `/${locale}/snakes/identify`,
      label: t.nav.snakes,
      icon: ShieldAlert,
    },
    {
      href: `/${locale}/snakes/antivenom`,
      label: t.nav.antivenom,
      icon: Activity,
    },
    {
      href: `/${locale}/snakes/first-aid`,
      label: t.nav.firstAid,
      icon: BookOpen,
    },
    { href: `/${locale}/pests/identify`, label: t.nav.pests, icon: Bug },
    { href: `/${locale}/pests/dosage`, label: t.nav.dosage, icon: Calculator },
    {
      href: `/${locale}/emergency`,
      label: t.nav.emergency,
      icon: PhoneCall,
      isEmergency: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-bg-surface/85 backdrop-blur-md border-b border-border-subtle/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo with Signature Emblem */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 group focus:outline-hidden shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-md ring-1 ring-emerald-500/30 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-emerald-100" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg leading-tight tracking-tight text-text-primary group-hover:text-brand-primary transition-colors">
                  {t.app.title}
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>v2.4 AI Vision</span>
                </span>
              </div>
              <span className="text-[11px] text-text-muted hidden sm:inline-block leading-tight line-clamp-1">
                {t.app.subtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              if (link.isEmergency) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emergency-red text-white font-bold text-xs hover:bg-emergency-hover transition-all shadow-xs glow-emergency ml-2 active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                    <span>{link.label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-bg-subtle text-brand-primary font-bold shadow-2xs border border-border-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-75" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Selector & Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-subtle bg-bg-surface/80 hover:bg-bg-subtle text-text-primary text-xs font-bold transition-all shadow-2xs focus:outline-hidden"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-brand-primary" />
                <span>
                  {LOCALE_NAMES[locale]?.nativeName || locale.toUpperCase()}
                </span>
              </button>

              {isLangDropdownOpen && (
                <div
                  className={`absolute mt-2 w-48 rounded-2xl border border-border-subtle bg-bg-surface/95 backdrop-blur-md shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isRtl ? 'left-0' : 'right-0'
                  }`}
                >
                  {SUPPORTED_LOCALES.map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleLanguageChange(loc)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-bg-subtle transition-colors ${
                        loc === locale
                          ? 'font-bold text-brand-primary bg-brand-primary/5'
                          : 'text-text-primary'
                      }`}
                    >
                      <span>{LOCALE_NAMES[loc].nativeName}</span>
                      <span className="text-[11px] text-text-muted">
                        {LOCALE_NAMES[loc].name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Portal Button */}
            <Link
              href={`/${locale}/admin`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-primary/30 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold transition shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-subtle focus:outline-hidden shadow-2xs"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-bg-surface px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  link.isEmergency
                    ? 'bg-emergency-red text-emergency-foreground font-bold'
                    : isActive
                      ? 'bg-bg-subtle text-brand-primary font-semibold'
                      : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <Link
            href={`/${locale}/admin`}
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-bold text-brand-primary bg-brand-primary/10 mt-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      )}
    </header>
  );
}
