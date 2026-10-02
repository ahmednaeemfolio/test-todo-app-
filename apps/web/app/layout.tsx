import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo list",
  description: "A simple shared space for keeping track of todos.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="site-header">
            <a className="wordmark" href="/" aria-label="Todo list home">
              Todo list
            </a>
          </header>
          <main className="content-column">{children}</main>
        </div>
      </body>
    </html>
  );
}
