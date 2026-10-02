import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A quiet, shared space to keep track of your todos.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F7F8FA",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
