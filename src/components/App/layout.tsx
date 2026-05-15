import { Outlet } from "react-router-dom"
import Header from "../Header"

export default function Layout() {
  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-30 grid-bg" />
      <Header />
      <Outlet />
      <footer className="container py-8 mt-10 border-t border-neon-purple/20 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <span>© DOTACTICS // ALL SYSTEMS OPERATIONAL</span>
        <span className="text-neon-cyan">
          v1.0 ▌{' '}
          <a
            href="https://stratz.com/api"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neon-pink hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            POWERED BY STRATZ API
          </a>
        </span>
      </footer>
    </div>
  )
}
