import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Memorial com QR Code',
  description: 'MVP de memoriais digitais com QR Code',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen">
          <header className="border-b bg-white shadow-sm">
            <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
              <div className="font-semibold text-lg">Memorial</div>
              <nav className="text-sm space-x-4 text-slate-600">
                <a href="/login">Entrar</a>
                <a href="/mvp">Sobre o MVP</a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
