import { useRoutes } from "react-router-dom"
import { Dashboard, Profile } from "../pages"

export default function BaseRouter() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Dashboard />
    },
    {
      path: "/profile/:playerId",
      element: <Profile />,
    }
  ])

  return routes
}
