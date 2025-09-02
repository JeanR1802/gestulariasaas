import React from "react";

export const metadata = {
  title: "Mi SaaS Multitenant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="container mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
