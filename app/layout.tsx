import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "react draggable table",
  description: "react draggable table sample",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
