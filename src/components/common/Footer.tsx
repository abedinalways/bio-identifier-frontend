'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, HeartHandshake, Sprout, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';

export function Footer() {
  const { locale, t } = useTranslation();

  return (
    <footer className="bg-bg-surface border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-500/30">
                <ShieldAlert className="w-4 h-4 text-emerald-100" />
              </div>
              <span className="font-extrabold text-lg text-text-primary tracking-tight">
                {t.app.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md">
              {t.app.subtitle}
            </p>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-bg-subtle/80 border border-border-subtle text-xs text-text-muted leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-brand-primary mt-0.5" />
              <p>{t.footer.disclaimer}</p>
            </div>
          </div>

          {/* Column 2: Snake & Emergency Links */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <HeartHandshake className="w-4 h-4 text-venom-deadly" />
              <span>{t.nav.snakes}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li>
                <Link
                  href={`/${locale}/snakes/identify`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {t.nav.snakes}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/snakes/antivenom`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {t.nav.antivenom}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/snakes/first-aid`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {t.nav.firstAid}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/emergency`}
                  className="text-venom-deadly font-semibold hover:underline"
                >
                  {t.nav.emergency}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Crop Protection Links */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Sprout className="w-4 h-4 text-brand-primary" />
              <span>{t.nav.pests}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li>
                <Link
                  href={`/${locale}/pests/identify`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {t.nav.pests}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/pests/dosage`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {t.nav.dosage}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/pests/encyclopedia`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {t.nav.encyclopedia}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-3">
          <p>
            © {new Date().getFullYear()} {t.app.title}. {t.footer.rights}
          </p>
          <p className="text-center sm:text-right">{t.app.badge}</p>
        </div>
      </div>
    </footer>
  );
}
