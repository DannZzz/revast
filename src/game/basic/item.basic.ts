import { Point, Size } from 'src/global/global'
import { ResourceTypes } from './bio-item.basic'
import { BasicStaticItem, StaticSettableItem } from './static-item.basic'
import { PlayerState } from '../types/player.types'
import { Player } from '../player/player'

export interface Eatable {
  toFood: number
  toHealth: number
  resourceType?: ResourceTypes
}

export interface Resource {
  resourceType: ResourceTypes
}

export type EquipableItemType = 'weapon' | 'tool'

export type ResourceGetting = { [k in ResourceTypes]?: number }

export type TwoHandMode = {
  point?: Point
  size?: Size
  rotation?: number
}

export type TwoHandModeNode = {
  itemNode?: TwoHandMode
  handNode?: TwoHandMode
}

export interface Equipable {
  equipable: true
  type: EquipableItemType
  drawPosition: Point
  startRotationWith: number
  range: number
  damage: number
  damageBuilding?: number
  size: Size
  decreaseAttackSpeed?: number
  resourceGettingPower: ResourceGetting
  toggleClicks?: number
  twoHandMode?: {
    active?: TwoHandModeNode
    noActive?: TwoHandModeNode
  }
}

export interface Any {}

export type HighlightType = 'circle' | 'rect'
export interface Highlight<T extends HighlightType> {
  type: T
  data: T extends 'circle' ? { radius: number } : { point: Point; size: Size }
}

export interface SpecialSettable {
  firePlace?: {
    within: (this: StaticSettableItem, point: Point) => boolean
    addsTemperature: number
  }
  workbench?: {
    within: (this: StaticSettableItem, point: Point) => boolean
  }
}

export interface SettableMode {
  trigger: 'attack'
  verify: (this: StaticSettableItem, player: Player) => boolean
  source: string
  cover: boolean
}

export interface Settable {
  hp: number
  showHpRadius?: number
  setMode: {
    offset: Point
    itemSize:
      | { type: 'circle'; radius: number }
      | { type: 'rect'; width: number; height: number }
  }
  size: Size
  cover: boolean
  type?: string
  highlight?: Highlight<HighlightType>
  durationSeconds?: number
  special?: SpecialSettable
  onThe: {
    water: boolean
  }
  mode?: SettableMode
}

export interface Wearable {
  type: 'helmet'
  wearing: true
  source: string
  iconSource: string
  defense?: {
    player: number
    mob: number
  }
  craftable?: Craftable
  drawPosition: Point
  size: Size
}

export type ItemsByTypes =
  | Any
  | Eatable
  | Equipable
  | Resource
  | Settable
  | Wearable

export interface Craftable {
  givesXp: number
  duration: number
  state?: Partial<PlayerState>
  required: { [k: number]: number }
}

type BasicItemPropsDefault = {
  source?: string
  iconSource: string
  id: number
  craftable?: Craftable
  flip?: boolean
  specialName?: string
  notAddable?: boolean
  maxAmount?: number
  name: string
}

export type ItemProps<T extends object = {}> = T & BasicItemPropsDefault

class BasicItem<T extends ItemsByTypes> {
  readonly data: ItemProps<T>
  constructor(data: ItemProps<T>) {
    this.data = data
  }

  isEquipable(): this is Item<Equipable> {
    return 'equipable' in this.data
  }

  isEatable(): this is Item<Eatable> {
    return 'toFood' in this.data
  }

  isResource(): this is Item<Resource> {
    return 'resourceType' in this.data
  }

  isWearable(): this is Item<Wearable> {
    return 'wearing' in this.data
  }

  get id(): number {
    return this.data.id
  }

  get source(): string {
    return this.data.source
  }
  get iconSource(): string {
    return this.data.iconSource
  }
  get craftable() {
    return this.data.craftable
  }

  get flip(): boolean {
    return !!this.data.flip
  }
}

export type Item<T extends ItemsByTypes> = BasicItem<T>

export const Item = BasicItem
