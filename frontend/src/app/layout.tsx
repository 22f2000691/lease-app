import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lease Management System",
  description: "Automated operational ledger for commercial real estate owners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
