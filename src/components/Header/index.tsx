import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import { Switch } from "../../components/ui/switch"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "../ui/navigation-menu"
import { Label } from "../ui/label"
import { setDarkMode } from "../../store/reducer/darkMode"
import { useDispatch, useSelector } from "react-redux"
import { setPlayerId } from "../../store/reducer/playerId"

export default function Header() {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.darkMode.value)
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState<string>('')

  const handleChangeInput = (val) => {
    setSearchInput(val)
  }

  const handleSubmitSearch = (evt) => {
    navigate(`/profile/${searchInput}`)
    dispatch(setPlayerId(searchInput))
    evt.preventDefault()
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="gradient-bg pt-3 pb-5 border-b">
      <div className="container">
        <div className="flex justify-end items-center gap-2 mb-3">
          <Label htmlFor="switch-mode">Light</Label>
          <Switch id="switch-mode" checked={darkMode} onCheckedChange={(evt) => dispatch(setDarkMode(evt))} />
          <Label htmlFor="switch-mode">Dark</Label>
        </div>
        <div className="flex justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                  Dotactics
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <form onSubmit={handleSubmitSearch} className="flex gap-3">
            <Input
              className="md:w-96"
              type="text"
              placeholder="Search"
              onChange={(evt) => handleChangeInput(evt.target.value)}
            />
            <Button disabled={!searchInput} type="submit">Search</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
