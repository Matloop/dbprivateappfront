import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsapp";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/theme-provider"; // Ajuste o import se necessário

const inter = Inter({ subsets: ["latin"] });

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
    // REMOVA o className="dark" daqui para o next-themes controlar
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {/* Use bg-background e text-foreground aqui */}
            <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <FloatingWhatsApp />
              
              {/* Footer com cores semânticas */}
              <footer className="bg-card p-5 text-center text-muted-foreground text-xs border-t border-border">
                 DB PRIVATE © 2025 - Todos os direitos reservados.
              </footer>
              <Toaster />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}