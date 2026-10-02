import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A shared list for the things you need to do.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <a className="wordmark" href="/" aria-label="Todo home">
              <span className="wordmark-mark" aria-hidden="true">
                ✓
              </span>
              <span>todo</span>
            </a>
            <p className="shared-label">A shared list</p>
          </header>
          <main className="app-content">{children}</main>
          <footer className="app-footer">A little more room for what matters.</footer>
        </div>
      </body>
    </html>
  );
}
