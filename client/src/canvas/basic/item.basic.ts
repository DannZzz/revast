import { Node } from "konva/lib/Node"
import { ResourceTypes } from "./bio-item.basic"

export interface Eatable {
  toFood: number
  toHealth: number
  resourceType?: ResourceTypes
}

export interface Resource {
  resourceType: ResourceTypes
}

export type EquipableItemType = "weapon" | "tool"

export type ResourceGetting = { [k in ResourceTypes]?: number }

export interface Equipable {
  equipable: true
  type: EquipableItemType
  drawPosition: Point
  startRotationWith: number
  range: number
  damage: number
  decreaseAttackSpeed?: number
  resourceGettingPower: ResourceGetting
  toggleClicks?: number
  twoHandMode?: {
    animate: (activeHand: boolean, node: Node, handNode: Node) => void
  }
}

export interface Settable {
  setMode: {
    grid: boolean
    offset: Point
    itemSize: Size
  }
  size: Size
}

export type ItemsByTypes = Eatable | Equipable | Resource | Settable

type BasicItemPropsDefault = {
  url?: string
  iconUrl: string
  id: number
  craftDuration?: number
  flip?: true
  settable?: boolean
}

export type ItemProps<T extends object = {}> = T & BasicItemPropsDefault

class BasicItem<T extends ItemsByTypes> {
  constructor(readonly data: Partial<ItemProps<T>>) {}

  get id(): number {
    return this.data.id
  }

  get url(): string {
    return this.data.url
  }
  get iconUrl(): string {
    return this.data.iconUrl
  }
  get craftDuration() {
    return this.data.craftDuration
  }

  get flip(): boolean {
    return !!this.data.flip
  }
}

export type Item<T extends ItemsByTypes> = BasicItem<T>

export const Item = BasicItem
