import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { setPlayerId } from "../../store/reducer/playerId"

const EXAMPLE_PLAYER_ID = "131933530"

const STACK = [
  "react.js",
  "redux",
  "vite",
  "apollo-client",
  "typescript",
  "react-router-dom",
  "tailwindcss",
  "shadcn-ui",
]

export function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [input, setInput] = useState("")

  const submit = (id: string) => {
    if (!id) return
    dispatch(setPlayerId(id))
    navigate(`/profile/${id}`)
  }

  return (
    <main className="relative">
      {/* hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-72 grid-perspective opacity-40" />
        <div aria-hidden className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-neon-purple/20 blur-3xl" />

        <div className="container relative pt-12 pb-20 md:pt-20 md:pb-28">
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              <span data-text="TRACK YOUR" className="glitch block neon-text-purple">TRACK YOUR</span>
              <span className="block mt-2 neon-text-pink">DOTA 2 PROFILE</span>
            </h1>

            <p className="max-w-xl text-sm md:text-base text-muted-foreground font-mono">
              Pull live match telemetry, rank tiers, hero loadouts, and talent trees.
              Drop a Steam ID, hit engage, watch the HUD light up.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); submit(input) }}
              className="mt-2 flex w-full max-w-xl flex-col sm:flex-row gap-3"
            >
              <Input
                placeholder="ENTER STEAM ID"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-12 text-base"
              />
              <Button type="submit" size="lg" disabled={!input}>
                Engage
              </Button>
            </form>

            <button
              onClick={() => submit(EXAMPLE_PLAYER_ID)}
              className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neon-cyan/80 hover:text-neon-cyan cursor-pointer transition-colors"
            >
              <span className="inline-block w-6 h-px bg-neon-cyan/60 group-hover:bg-neon-cyan transition-colors" />
              Try example ID · {EXAMPLE_PLAYER_ID}
            </button>
          </div>
        </div>
      </section>

      {/* stack + links */}
      <section className="container pb-20">
        <div className="panel corner-cuts p-6 md:p-8 relative scanlines">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-display text-xs uppercase tracking-[0.3em] neon-text-cyan">// stack.config</span>
            <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/60 to-transparent" />
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {STACK.map((tech) => (
              <Badge key={tech} variant={tech.includes("react") || tech.includes("typescript") ? "secondary" : "default"}>
                {tech}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-3 text-sm font-mono">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/renzivan/reactjs-dota2-profile-tracker"
              className="group flex items-center justify-between border border-border hover:border-neon-purple/70 p-3 rounded-sm transition-colors cursor-pointer"
            >
              <span className="text-muted-foreground group-hover:text-neon-purple uppercase tracking-wider text-xs">Repository</span>
              <span className="text-neon-purple">→</span>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://renzivan.github.io"
              className="group flex items-center justify-between border border-border hover:border-neon-cyan/70 p-3 rounded-sm transition-colors cursor-pointer"
            >
              <span className="text-muted-foreground group-hover:text-neon-cyan uppercase tracking-wider text-xs">Architect</span>
              <span className="text-neon-cyan">→</span>
            </a>
            <a
              href="mailto:renzivanyapenguio@gmail.com"
              className="group flex items-center justify-between border border-border hover:border-neon-pink/70 p-3 rounded-sm transition-colors cursor-pointer"
            >
              <span className="text-muted-foreground group-hover:text-neon-pink uppercase tracking-wider text-xs">Contact</span>
              <span className="text-neon-pink">→</span>
            </a>
          </div>
        </div>
        <Link
          to={`/profile/${EXAMPLE_PLAYER_ID}`}
          onClick={() => dispatch(setPlayerId(EXAMPLE_PLAYER_ID))}
          className="sr-only"
        >
          Example
        </Link>
      </section>
    </main>
  )
}
