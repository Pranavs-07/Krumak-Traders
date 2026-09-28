import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/common/Providers';

export const metadata = {
  title: 'KRUMAK TRADERS — Premium Laboratory & Scientific Equipment',
  description: 'Your trusted partner for laboratory and scientific equipment with 10+ years of experience. Analytical instruments, life science equipment, chemistry apparatus, microscopes, glassware, and more.',
  keywords: 'laboratory equipment, scientific instruments, HPLC, chromatography, microscopes, glassware, chemical balances, educational kits, KRUMAK TRADERS',
  openGraph: {
    title: 'KRUMAK TRADERS — Premium Laboratory & Scientific Equipment',
    description: 'Your trusted partner for laboratory and scientific equipment with 10+ years of experience.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
