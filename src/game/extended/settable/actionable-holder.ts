import { Point } from 'src/global/global'
import { GetSet } from 'src/structures/GetSet'

export interface ActionableHolderProps {
  allow: number[]
  takeable: boolean
  drawOffset: Point
  noBackground: boolean
}

export type HolderData = { id: number; quantity: number }

export class ActionableItemHolder implements ActionableHolderProps {
  data: GetSet<HolderData> = GetSet({ id: 0, quantity: 0 })
  allow: number[]
  takeable: boolean
  drawOffset: Point
  noBackground: boolean

  id() {
    return this.data().id
  }

  quantity() {
    return this.data().quantity
  }

  allows(itemId: number) {
    if (this.allow.length === 0) return true
    return this.allow.includes(itemId)
  }

  constructor(props: ActionableHolderProps) {
    Object.assign(this, props)
  }

  take() {
    this.data({ id: 0, quantity: 0 })
  }

  add(itemId: number, quantity: number) {
    this.data({ id: itemId, quantity: (this.data().quantity || 0) + quantity })
  }

  init(defaultData: HolderData) {
    this.data(defaultData)
  }

  filterHolder(cb: (data: HolderData) => boolean) {
    this.data.onChange((val, old) => {
      const can = cb(val)
      if (!can) return old
    })
  }
}
