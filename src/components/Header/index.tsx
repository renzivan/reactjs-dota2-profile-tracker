import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useDispatch } from "react-redux"
import { setPlayerId } from "../../store/reducer/playerId"
import './index.css'

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState<string>('')

  const handleChangeInput = (val: string) => {
    setSearchInput(val)
  }

  const handleSubmitSearch = (evt: React.FormEvent<HTMLFormElement>) => {
    navigate(`/profile/${searchInput}`)
    dispatch(setPlayerId(searchInput))
    evt.preventDefault()
  }

  return (
    <header className="relative border-b border-gold/30 bg-background/40 backdrop-blur-md">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bronze to-transparent opacity-60" />

      <div className="container py-5">
        <div className="flex flex-wrap justify-center gap-4 md:justify-between items-center">
          <Link to="/" className="group flex gap-3 items-center cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold/30 blur-xl group-hover:bg-gold/50 transition-colors" />
              <img src="/logo.svg" alt="Dotactics" className="relative w-12 torch-flicker" />
            </div>
            <span className="aegis-title text-3xl md:text-4xl gold-text-strong">
              DOTACTICS
            </span>
          </Link>

          <form onSubmit={handleSubmitSearch} className="flex gap-3 items-stretch">
            <Input
              className="md:w-[260px] lg:w-[360px]"
              type="text"
              placeholder="Dota ID"
              onChange={(evt) => handleChangeInput(evt.target.value)}
            />
            <Button disabled={!searchInput} type="submit">
              Search
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
