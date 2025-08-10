import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cadastro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased font-inter`}>{children}</body>
    </html>
  );
}
