import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type PageLayoutProps = {
  children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <Header />
        <section className="content">{children}</section>
      </main>
    </div>
  );
}