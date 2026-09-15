import { useParams } from 'react-router-dom'
import Matches from '../../components/Matches'

/** The Overview tab: the existing match history, now a nested route. */
export function ProfileOverview() {
  const { playerId } = useParams<{ playerId: string }>()
  return (
    <div className="mt-6">
      <Matches playerId={playerId} />
    </div>
  )
}
