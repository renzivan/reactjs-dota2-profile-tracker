import { useItemsCatalog } from "../../services/items.service"
import { cn } from "../../lib/utils"
import ItemIcon from "../ItemIcon"

type ItemsProps = {
  /** Slots in inventory order. Empty slots stay in place, so nulls belong here. */
  matchItems: (number | null)[]
  className?: string
  itemClassName?: string
}

/** A row of inventory slots, resolved against the item catalog once. */
export default function Items({ matchItems, className, itemClassName }: ItemsProps) {
  const items = useItemsCatalog()

  return (
    <div className={cn("flex flex-wrap max-w-32 items-center justify-center gap-1", className)}>
      {matchItems.map((matchItem, index) => (
        <ItemIcon
          key={index}
          itemId={matchItem}
          item={items.find((it) => it.id === matchItem)}
          className={itemClassName}
        />
      ))}
    </div>
  )
}
