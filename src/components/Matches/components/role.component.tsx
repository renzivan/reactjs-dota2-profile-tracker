import { getRole } from "../../../lib/utils"
import { Tooltip } from "../../ui/tooltip"

export default function Role({ lane, role }: { lane: string, role: string }) {
  const { displayName, shortName } = getRole(lane, role)

  return (
    <Tooltip 
      trigger={<img src={`/roles/${shortName}.svg`} alt="" className="w-7"/>}
      content={<p>{displayName}</p>}
    />
  )
}
