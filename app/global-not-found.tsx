import type { CSSProperties } from 'react';
import { Manrope, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import Link from 'next/link';

import './globals.css';
import { BackButton } from './components/buttons/BackButton';


const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['500'],
  display: 'swap',
});

// Point the site's existing --font-display / --font-mono tokens at the
// fonts loaded here, since this file doesn't get the root layout's fonts.
const fontTokenOverrides = {
  '--font-display': 'var(--font-manrope)',
  '--font-mono': 'var(--font-jetbrains-mono)',
} as CSSProperties;

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
      style={fontTokenOverrides}
    >
      <body className="bg-bg text-text">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
          {/* signature element: the mapped route breaking into a cold trail */}
          <div
            className="anim-fade pointer-events-none absolute inset-x-0 top-[10%] mx-auto h-64 w-full max-w-2xl"
            aria-hidden="true"
          >
            <svg viewBox="0 0 640 280" width="100%" height="100%" fill="none">
              {/* the known, mapped route */}
              <path
                d="M 24 236 C 120 236, 160 176, 216 168 C 272 160, 296 108, 368 96"
                stroke="var(--border-strong)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 10"
                style={{ animation: 'dashFlow 3s linear infinite' }}
              />

              {/* the break point */}
              <circle cx="368" cy="96" r="5" fill="var(--red)" />
              <path
                d="M 361 89 L 375 103 M 375 89 L 361 103"
                stroke="var(--red)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* the trail going cold */}
              <circle
                cx="404"
                cy="84"
                r="3.5"
                fill="var(--accent)"
                opacity="0.85"
              />
              <circle
                cx="438"
                cy="100"
                r="3"
                fill="var(--accent)"
                opacity="0.65"
              />
              <circle
                cx="462"
                cy="70"
                r="2.5"
                fill="var(--accent)"
                opacity="0.5"
              />
              <circle
                cx="498"
                cy="88"
                r="2.5"
                fill="var(--accent)"
                opacity="0.35"
              />
              <circle
                cx="516"
                cy="54"
                r="2"
                fill="var(--accent)"
                opacity="0.25"
              />
              <circle
                cx="552"
                cy="66"
                r="2"
                fill="var(--accent)"
                opacity="0.15"
              />
            </svg>
          </div>

          <div className="anim-reveal relative z-10 max-w-xl text-center">
            <p className="label-mono mb-6">ROUTE STATUS — UNMAPPED</p>

            <h1 className="font-display mb-4 text-[clamp(5rem,16vw,9rem)] font-semibold leading-none tracking-tight text-text">
              404
            </h1>

            <p className="mb-3 text-lg font-semibold text-text">
              This path doesn&apos;t exist on our map.
            </p>
            <p className="mb-10 leading-relaxed text-text-muted">
              The page may have been moved, renamed, or never existed at all.
              Let&apos;s get you back to a route that&apos;s actually on the
              map.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className="btn-primary">
                Back to homepage
              </Link>
              <BackButton className="btn-ghost" />
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
