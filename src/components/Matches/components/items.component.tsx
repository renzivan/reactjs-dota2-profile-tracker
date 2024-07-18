import { useDispatch, useSelector } from "react-redux"
import { useGetItems } from "../../../services/items.service"
import { useEffect } from "react"
import { setItems } from "../../../store/reducer/items"
import { Tooltip } from "../../ui/tooltip"
import { RootState } from "../../../store"

interface ItemsProps {
  matchItems: number[]
}

export default function Items({ matchItems }: ItemsProps) {
  const items = useSelector((state: RootState) => state.items.value)
  const { data } = useGetItems()
  const dispatch = useDispatch()

  useEffect(() => {
    if (data && items.length === 0) {
      dispatch(setItems(Object.values(data)))
    }
  }, [dispatch, data, items])

  return (
    <div className="flex flex-wrap max-w-32 items-center justify-center gap-1">
      {matchItems.map((matchItem, index) => {
        const item = items.find(it => it.id === matchItem)
        return item ? (
          <Tooltip
            key={index}
            trigger={<img src={`https://cdn.stratz.com/images/dota2/items/${item.shortName}.png`} className="rounded w-10 h-7" alt="" />}
            content={<p>{item.displayName}</p>}
          />
        ) : (<div key={index} className="bg-accent rounded w-10 h-7"/>)
      })}
    </div>
  )
}
