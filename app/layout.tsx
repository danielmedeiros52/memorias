import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Memorial com QR Code',
  description: 'MVP de memorial digital'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen">
          <header className="bg-indigo-700 text-white py-4">
            <div className="container-page flex justify-between items-center">
              <div className="font-bold text-xl">Memorial com QR Code</div>
              <nav className="space-x-4 text-sm">
                <a href="/login" className="hover:underline">Login</a>
                <a href="/m" className="hover:underline">Memoriais Públicos</a>
              </nav>
            </div>
          </header>
          <main className="container-page">{children}</main>
        </div>
      </body>
    </html>
  );
}
