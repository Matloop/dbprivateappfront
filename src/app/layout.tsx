import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsapp";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";

// Fonte do Google otimizada pelo Next
const inter = Inter({ subsets: ["latin"] });

// SEO GLOBAL
export const metadata: Metadata = {
  title: {
    template: '%s | DB Private',
    default: 'DB Private - Imóveis de Alto Padrão',
  },
  description: 'Consultoria imobiliária especializada em Balneário Camboriú e Praia Brava.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <FloatingWhatsApp />
            <footer className="bg-[#0f0f0f] p-5 text-center text-[#555] text-xs border-t border-[#222]">
               DB PRIVATE © 2025 - Todos os direitos reservados.
            </footer>
            <Toaster theme="dark" position="top-right" />
          </div>
        </Providers>
      </body>
    </html>
  );
}