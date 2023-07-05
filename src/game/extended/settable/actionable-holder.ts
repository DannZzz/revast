import { Point } from 'src/global/global'
import { GetSet } from 'src/structures/GetSet'

export interface ActionableHolderProps {
  allow: number[]
  takeable: boolean
  drawOffset: Point
  noBackground: boolean
  max?: number
}

export type HolderData = { id: number; quantity: number }

export class ActionableItemHolder implements ActionableHolderProps {
  data: GetSet<HolderData> = GetSet({ id: 0, quantity: 0 })
  allow: number[]
  takeable: boolean
  drawOffset: Point
  noBackground: boolean
  max?: number = Infinity

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
    if ((this.data().quantity || 0) + quantity > this.max) {
      quantity = this.max - this.data().quantity || 0
    }
    this.data({ id: itemId, quantity: (this.data().quantity || 0) + quantity })
  }

  init(defaultData: HolderData) {
    this.data(defaultData)
  }

  full() {
    return this.quantity() >= this.max
  }

  filterHolder(cb: (data: HolderData) => boolean) {
    this.data.onChange((val, old) => {
      const can = cb(val)
      if (!can) return old
    })
  }
}
