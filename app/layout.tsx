import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "FutMax - Análises inteligentes para apostas esportivas",
  description: "FutMax ajuda apostadores 50+ com análises comparativas, crédito via PIX e relatórios em PDF.",
  metadataBase: new URL("https://futmax.local")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
