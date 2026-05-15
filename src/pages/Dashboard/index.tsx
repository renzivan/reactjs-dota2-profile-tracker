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
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gold/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-radiant/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-dire/10 blur-3xl" />

        <div className="container relative pt-14 pb-20 md:pt-20 md:pb-28">
          <div className="flex flex-col items-center text-center gap-5">
            <span className="font-display text-[11px] md:text-xs uppercase tracking-[0.45em] text-muted-foreground inline-flex items-center gap-3">
              <span className="inline-block w-1.5 h-1.5 rotate-45 bg-gold/70" />
              Dota 2 Profile Tracker
              <span className="inline-block w-1.5 h-1.5 rotate-45 bg-gold/70" />
            </span>

            <h1 className="aegis-title text-6xl md:text-8xl leading-[0.95] gold-text-strong tracking-[0.04em]">
              Truesight
            </h1>

            <div className="flex items-center gap-3 w-full max-w-md">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/60" />
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold">
                <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
              </svg>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/60" />
            </div>

            <p className="max-w-xl text-sm md:text-base text-muted-foreground">
              See every match, every hero, every talent —
              for any public profile. Drop a Dota ID and engage.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); submit(input) }}
              className="mt-2 flex w-full max-w-xl flex-col sm:flex-row gap-3"
            >
              <Input
                placeholder="Dota ID"
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
              className="group inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-gold cursor-pointer transition-colors"
            >
              <span className="inline-block w-6 h-px bg-muted-foreground/60 group-hover:bg-gold transition-colors" />
              Try example · {EXAMPLE_PLAYER_ID}
              <span className="inline-block w-6 h-px bg-muted-foreground/60 group-hover:bg-gold transition-colors" />
            </button>
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <div className="panel brackets p-6 md:p-8 relative">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-display text-xs uppercase tracking-[0.3em] gold-text">// Arsenal</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gold/50 to-transparent" />
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {STACK.map((tech) => (
              <Badge key={tech} variant={tech.includes("react") || tech.includes("typescript") ? "secondary" : "default"}>
                {tech}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/renzivan/reactjs-dota2-profile-tracker"
              className="group flex items-center justify-between border border-border hover:border-gold/70 p-3 rounded-sm transition-colors cursor-pointer"
            >
              <span className="text-muted-foreground group-hover:text-gold uppercase tracking-[0.18em] text-xs font-display">Repository</span>
              <span className="text-gold">→</span>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://renzivan.github.io"
              className="group flex items-center justify-between border border-border hover:border-mana/70 p-3 rounded-sm transition-colors cursor-pointer"
            >
              <span className="text-muted-foreground group-hover:text-mana uppercase tracking-[0.18em] text-xs font-display">Architect</span>
              <span className="text-mana">→</span>
            </a>
            <a
              href="mailto:renzivanyapenguio@gmail.com"
              className="group flex items-center justify-between border border-border hover:border-radiant/70 p-3 rounded-sm transition-colors cursor-pointer"
            >
              <span className="text-muted-foreground group-hover:text-radiant uppercase tracking-[0.18em] text-xs font-display">Contact</span>
              <span className="text-radiant">→</span>
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
