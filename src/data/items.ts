import { Item, ItemsByTypes } from '../game/basic/item.basic'
import { Chest } from 'anytool'

export const Items = new Chest<number, Item<ItemsByTypes>>()

export const itemById = <T extends Item<ItemsByTypes> = Item<ItemsByTypes>>(
  id: number,
): T => {
  return Items.find((i) => i.id === id) as any
}
