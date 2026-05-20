import type { ReactNode } from "react";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

type PageLayoutProps = {
  children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <section className="content">{children}</section>
      </main>
    </div>
  );
}