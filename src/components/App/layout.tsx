import { Outlet } from "react-router-dom"
import Header from "../Header"

export default function Layout() {
  return (
    <div className="relative min-h-dvh">
      <Header />
      <Outlet />
      <footer className="container py-8 mt-10 border-t border-gold/20 flex flex-col md:flex-row items-center justify-between gap-3 font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>© Dotactics</span>
        <span className="text-gold">
          v1.0 ·{' '}
          <a
            href="https://stratz.com/api"
            target="_blank"
            rel="noreferrer"
            className="hover:text-radiant hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            Powered by Stratz API
          </a>
        </span>
      </footer>
    </div>
  )
}
