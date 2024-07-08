import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { Link } from "@radix-ui/react-navigation-menu"
import { navigationMenuTriggerStyle } from "../ui/navigation-menu"

export default function Header() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState<string>('')

  const handleChangeInput = (val) => {
    setSearchInput(val)
  }

  const handleSubmitSearch = () => {
    navigate(`/profile/${searchInput}`)
  }

  return (
    <div className="flex justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" className={navigationMenuTriggerStyle()}>
              Dashboard
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <form onSubmit={() => handleSubmitSearch()} className="flex gap-3">
        <Input
          className="md:w-96"
          type="text"
          placeholder="Search"
          onChange={(evt) => handleChangeInput(evt.target.value)}
        />
        <Button disabled={!searchInput} type="submit">Search</Button>
      </form>
    </div>
  )
}
