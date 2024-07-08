import { useRoutes } from "react-router-dom"
import { Dashboard, Profile } from "../pages"
import Layout from '@/components/App/layout'

export default function BaseRouter() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/profile/:playerId",
          element: <Profile />,
        }
      ]
    }
  ])

  return routes
}
