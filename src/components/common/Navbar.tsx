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
} from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import { SUPPORTED_LOCALES, LOCALE_NAMES, type SupportedLocale } from '../../config/i18n.config';

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
    { href: `/${locale}/snakes/identify`, label: t.nav.snakes, icon: ShieldAlert },
    { href: `/${locale}/snakes/antivenom`, label: t.nav.antivenom, icon: Activity },
    { href: `/${locale}/snakes/first-aid`, label: t.nav.firstAid, icon: BookOpen },
    { href: `/${locale}/pests/identify`, label: t.nav.pests, icon: Bug },
    { href: `/${locale}/pests/dosage`, label: t.nav.dosage, icon: Calculator },
    { href: `/${locale}/emergency`, label: t.nav.emergency, icon: PhoneCall, isEmergency: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-bg-surface border-b border-border-subtle shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 group focus:outline-hidden"
          >
            {/* <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-brand-primary-foreground shadow-sm">
             
            </div> */}
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-text-primary group-hover:text-brand-primary transition-colors">
                {t.app.title}
              </span>
              <span className="text-xs text-text-muted hidden sm:inline-block">
                {t.app.subtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              if (link.isEmergency) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emergency-red text-emergency-foreground font-semibold text-sm hover:bg-emergency-hover transition-colors shadow-xs ml-1"
                  >
                    <PhoneCall className="w-4 h-4 animate-pulse" />
                    <span>{link.label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-bg-subtle text-brand-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-75" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Selector & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-subtle bg-bg-surface text-text-primary text-sm font-medium hover:bg-bg-subtle transition-colors focus:outline-hidden"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4 text-text-muted" />
                <span>{LOCALE_NAMES[locale]?.nativeName || locale.toUpperCase()}</span>
              </button>

              {isLangDropdownOpen && (
                <div
                  className={`absolute mt-2 w-44 rounded-xl border border-border-subtle bg-bg-surface shadow-lg py-1 z-50 ${
                    isRtl ? 'left-0' : 'right-0'
                  }`}
                >
                  {SUPPORTED_LOCALES.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleLanguageChange(loc)}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-bg-subtle transition-colors ${
                        loc === locale
                          ? 'font-bold text-brand-primary bg-bg-subtle'
                          : 'text-text-primary'
                      }`}
                    >
                      <span>{LOCALE_NAMES[loc].nativeName}</span>
                      <span className="text-xs text-text-muted">{LOCALE_NAMES[loc].name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-bg-surface px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
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
        </div>
      )}
    </header>
  );
}
