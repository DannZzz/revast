import { MobNames } from 'src/data/mobs'
import { Point, Size, combineClasses } from 'src/global/global'

export enum MobMoveStatus {
  IDLE,
  ATTACK,
}

export interface MoveTactic<T extends MobMoveStatus> {
  type: T
  speed: number
  interval: number | (() => number)
  duration: number
}

export type MobDefaultMoveTactic = {
  idleTactic: Omit<MoveTactic<MobMoveStatus.IDLE>, 'type'>
  otherTactics: MoveTactic<MobMoveStatus>[]
}

export interface BasicMobProps {
  source: string
  hurtSource: string
  givesXP: number
  size: Size
  hitbox: number
  reactRadius: number
  damage: number
  name: MobNames
  hp: number
  attackRadius: number
  damageInterval: number
  drop: { [k: number]: number }
  moveTactic: MobDefaultMoveTactic
}

export class BasicMob implements BasicMobProps {
  constructor(data: BasicMobProps) {
    Object.assign(this, data)
  }
  hitbox: number
  drop: { [k: number]: number }
  hurtSource: string
  hp: number
  givesXP: number
  damage: number
  attackRadius: number
  source: string
  name: MobNames
  damageInterval: number
  size: Size
  reactRadius: number
  moveTactic: MobDefaultMoveTactic
}
