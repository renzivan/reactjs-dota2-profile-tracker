import { Suspense, lazy } from "react"
import { useRoutes } from "react-router-dom"
import { Dashboard, Profile, ProfileOverview } from "../pages"
import Layout from "../components/App/layout"
import Spinner from "../components/Spinner"

// Kept out of the initial chunk: the Stats tab pulls in the date picker and the
// aggregation code, which the Overview never needs.
const Stats = lazy(() => import("../components/Stats"))

function StatsFallback() {
  return (
    <div className="container mt-6 flex justify-center py-16">
      <Spinner />
    </div>
  )
}

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
            {
              path: "stats",
              element: (
                <Suspense fallback={<StatsFallback />}>
                  <Stats />
                </Suspense>
              ),
            },
          ],
        }
      ]
    }
  ])

  return routes
}
