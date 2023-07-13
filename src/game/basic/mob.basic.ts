import { MobNames } from 'src/data/mobs'
import { Gettable, Point, Size, combineClasses } from 'src/global/global'
import { GameServer } from '../server'
import { Player } from '../player/player'

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
  damage: number
  damageBuilding: number
  name: MobNames
  hp: number
  radius: {
    attack: number
    react: number
    collision: number
  }
  damageInterval: number
  drop: Gettable<{ [k: number]: number }>
  moveTactic: MobDefaultMoveTactic
}

export class BasicMob implements BasicMobProps {
  constructor(data: BasicMobProps) {
    Object.assign(this, data)
  }
  radius: { attack: number; react: number; collision: number }
  drop: Gettable<{ [k: number]: number }>
  hurtSource: string
  hp: number
  givesXP: number
  damage: number
  damageBuilding: number
  damageBuildingInterval: number
  source: string
  name: MobNames
  damageInterval: number
  size: Size
  moveTactic: MobDefaultMoveTactic
  onInit?: (gs: GameServer) => void
  onRemove?: (gs: GameServer, player: Player) => void
}
