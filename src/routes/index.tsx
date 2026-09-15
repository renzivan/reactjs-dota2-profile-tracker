import { useRoutes } from "react-router-dom"
import { Dashboard, Profile, ProfileOverview } from "../pages"
import Layout from "../components/App/layout"
import Stats from "../components/Stats"

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
          children: [
            { index: true, element: <ProfileOverview /> },
            { path: "stats", element: <Stats /> },
          ],
        }
      ]
    }
  ])

  return routes
}
