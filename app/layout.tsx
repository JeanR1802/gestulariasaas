import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers"; // 1. Importar el nuevo provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi SaaS Multitenant",
  description: "Creado con Next.js y Neon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* 2. Envolver a los children con el provider */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
