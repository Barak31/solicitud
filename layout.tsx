
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from '@/context/language-context';
import { BackgroundImage } from '@/components/alquila-facil/background-image';

export const metadata: Metadata = {
  title: 'Formulario de Alquiler de MisCasasRD',
  description: 'Agiliza tus solicitudes de alquiler con MisCasasRD. Una forma rápida y sencilla de solicitar tu próximo hogar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.webp" type="image/webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <BackgroundImage />
        <LanguageProvider>
          <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 lg:p-8 relative">
            {children}
          </main>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
