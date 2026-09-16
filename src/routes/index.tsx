import { Suspense, lazy } from "react"
import { useRoutes } from "react-router-dom"
import { Dashboard, Profile, ProfileOverview } from "../pages"
import Layout from "../components/App/layout"
import Spinner from "../components/Spinner"

// Kept out of the initial chunk: the Stats tab pulls in the date picker and the
// aggregation code, which the Overview never needs.
const Stats = lazy(() => import("../components/Stats"))

// Same for the match page, which only a match history row leads to.
const MatchDetail = lazy(() => import("../pages/MatchDetail").then((it) => ({ default: it.MatchDetail })))

function LazyFallback({ className = "container mt-6 flex justify-center py-16" }: { className?: string }) {
  return (
    <div className={className}>
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
                <Suspense fallback={<LazyFallback />}>
                  <Stats />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/match/:matchId",
          element: (
            <Suspense fallback={<LazyFallback className="container flex justify-center py-24" />}>
              <MatchDetail />
            </Suspense>
          ),
        }
      ]
    }
  ])

  return routes
}
