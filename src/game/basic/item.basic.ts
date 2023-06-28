import { Point, Size } from 'src/global/global'
import { ResourceTypes } from './bio-item.basic'
import { BasicStaticItem, StaticSettableItem } from './static-item.basic'
import { PlayerState } from '../types/player.types'
import { Player } from '../player/player'
import { Craft } from 'src/structures/Craft'
import { AssetLink } from 'src/structures/Transformer'
import { Exclude, Expose } from 'class-transformer'
import { ImageSource } from 'src/structures/image-base'
import { StaticItems } from 'src/structures/StaticItems'
import { GameMap } from 'src/structures/GameMap'

export interface Eatable {
  toFood: number
  toHealth: number
  toWater: number
  resourceType?: ResourceTypes
  giveAfterEat?: number
  custom?: (player: Player) => void
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
  digPower?: number
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

@Exclude()
export class SettableMode {
  trigger: 'attack' | 'custom'
  verify: (this: StaticSettableItem, player: Player) => boolean
  @AssetLink()
  @Expose({ name: 'url' })
  source?: ImageSource
  @Expose()
  cover: number
  switchTo?: number
  onStart?: (this: StaticSettableItem) => void
  damageOnAttack?: { all: boolean; damage: number }
  damageOnTouch?: {
    all: boolean
    radius: number
    damage: number
    interval: number
  }
  constructor(data: Settable) {
    Object.assign(this, data)
  }
}

export type SettableCheckers = 'all' | 'type'

export interface Settable {
  hp: number
  showHpRadius?: number
  ignoreCheckers?: SettableCheckers
  max?: number
  setMode: {
    grid?: boolean
    offset: Point
    itemSize:
      | { type: 'circle'; radius: number }
      | { type: 'rect'; width: number; height: number }
  }
  size: Size
  type?: string
  highlight?: Highlight<HighlightType>
  durationSeconds?: number
  special?: SpecialSettable
  onThe: {
    water: boolean
  }
  currentMode: number
  loop?: (settable: StaticSettableItem) => void
  modes?: SettableMode[]
  onDestroy?: (settable: StaticSettableItem) => void
  customSettingFilter?: (
    staticItems: StaticItems,
    settable: StaticSettableItem,
    map: GameMap,
  ) => boolean
}

export type DayNight<T = number> = { [k in 'day' | 'night']: T }

export class WearableEffect {
  inWaterSpeed: number = 0
  inWaterTempLoss: DayNight = { day: 0, night: 0 }
  oxygenLoss: number = 0
  heatPerc: DayNight = { day: 0, night: 0 }
  tempLossPerc: DayNight = { day: 0, night: 0 }

  constructor(data: Partial<WearableEffect>) {
    Object.assign(this, data)
  }
}

export interface Wearable {
  type: 'helmet' | 'hat'
  wearing: true
  source: string
  iconSource: string
  defense?: {
    player: number
    mob: number
  }
  effect: WearableEffect
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
  flip?: boolean
  specialName?: string
  notAddable?: boolean
  maxAmount?: number
  name: string
  resType?: ResourceTypes
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
    return Craft.data.some((crt) => crt.itemId === this.id)
  }

  get flip(): boolean {
    return !!this.data.flip
  }
}

export type Item<T extends ItemsByTypes> = BasicItem<T>

export const Item = BasicItem
