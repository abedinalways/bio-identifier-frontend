import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import StoreProvider from '@/store/StoreProvider';
import { LocaleProvider } from '@/i18n/LocaleContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { EmergencyBanner } from '@/components/common/EmergencyBanner';
import {
  SUPPORTED_LOCALES,
  isRTL,
  isValidLocale,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from '@/config/i18n.config';
import { getDictionary } from '@/i18n/getDictionary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale: SupportedLocale = isValidLocale(locale)
    ? locale
    : DEFAULT_LOCALE;
  const dict = getDictionary(activeLocale);

  return {
    title: {
      default: `${dict.app.title} | South Asia Emergency AI`,
      template: `%s | ${dict.app.title}`,
    },
    description: dict.app.subtitle,
    keywords: [
      'Snake identification',
      'Antivenom South Asia',
      'Russell viper',
      'Spectacled cobra',
      'Common krait',
      'Agricultural pest identifier',
      'Mango hopper',
      'Litchi fruit borer',
      'Pesticide dosage calculator',
      'Golden hour first aid',
      'Bangladesh snakebite',
      'India snakebite emergency',
    ],
    authors: [{ name: 'Dual Bio-Identifier Project' }],
    openGraph: {
      title: dict.app.title,
      description: dict.app.subtitle,
      locale: activeLocale,
      type: 'website',
      siteName: dict.app.title,
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.app.title,
      description: dict.app.subtitle,
    },
    alternates: {
      languages: {
        en: '/en',
        bn: '/bn',
        hi: '/hi',
        ur: '/ur',
        zh: '/zh',
        th: '/th',
      },
    },
  };
}

export default async function LocalizedRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale: SupportedLocale = isValidLocale(locale)
    ? locale
    : DEFAULT_LOCALE;
  const rtl = isRTL(activeLocale);

  return (
    <html
      lang={activeLocale}
      dir={rtl ? 'rtl' : 'ltr'}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-app text-text-primary">
        <StoreProvider>
          <LocaleProvider locale={activeLocale}>
            <EmergencyBanner />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LocaleProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
