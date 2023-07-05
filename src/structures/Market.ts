import { Player } from 'src/game/player/player'
import { isNumber } from 'src/utils/is-number-in-range'

export interface MarketItem {
  from: { id: number; quantity: number }
  to: { id: number; quantity: number }
}

export class Market {
  constructor(readonly items: MarketItem[], readonly maxAmount: number = 25) {}

  try(player: Player, i: number, amount: number) {
    if (!isNumber(i, 0, this.items.length - 1)) return
    const item: MarketItem = this.items[i]
    if (!item) return
    const count = Math.floor(amount / item.to.quantity)
    if (!isNumber(count, 1, this.maxAmount)) return
    if (
      !player.items.has(item.from.id, count * item.from.quantity) ||
      !player.items.addable(item.to.id)
    )
      return
    player.items._items.get(item.from.id).quantity -= Math.floor(
      count * item.from.quantity,
    )
    player.items._items = player.items.filterItems(player.items._items)
    player.items.addItem(item.to.id, item.to.quantity * count)
  }
}
