import { Expose, Type } from 'class-transformer'
import { EquipmentEntity } from 'src/entities/equipment.entity'
import { PlayerSkinEntity } from 'src/entities/player-skin.entity'
import { Point, Size } from 'src/global/global'
import { Biome, MapAreaName } from 'src/structures/GameMap'
import { LBMember } from 'src/structures/leaderboard/Leaderboard'
import { Token } from 'src/structures/tokens/Token'
import { Bio } from '../basic/bio-item.basic'
import { StaticSettableItem } from '../basic/static-item.basic'
import { Mob } from '../mobs/mob'
import { GameServer } from '../server'
import { BasicDrop } from '../basic/drop.basic'
import { WearingEntity } from 'src/entities/wearing.entity'
import { AssetLink } from 'src/structures/Transformer'
import { ClanMember } from 'src/structures/clans/ClanMember'
import { Misc } from '../basic/misc.basic'

export enum WalkEffect {
  water,
  footprints,
}

export type PlayerSkinName =
  | 'Repeat'
  | 'Snake'
  | 'Skeleton'
  | 'Shadow'
  | 'Oorod'
  | 'Purple Wolf'
  | 'Mini Red'
  | 'Yellow Bitten'
  | 'Vinselgon'

export class PlayerSkin {
  name: PlayerSkinName
  index: number
  handFile: string
  file: string

  constructor(data: PlayerSkin) {
    Object.assign(this, data)
  }
}

export interface PlayerItemTimeout {
  weapon: number
  helmet: number
  building: number
}

export interface PlayerState {
  fire: boolean
  workbench: boolean
  water: boolean
  onBridge: boolean
}

export class VisualPlayerData {
  id: string
  name: string
  point: Point

  @Type(() => PlayerSkinEntity)
  skin: PlayerSkinEntity

  clicking: { status: boolean; duration: number }

  rotation: number

  @Type(() => EquipmentEntity)
  equipment: EquipmentEntity | null

  @Type(() => WearingEntity)
  wearing: WearingEntity | null

  @AssetLink()
  @Expose({ name: 'bagUrl' })
  bagSource: string

  constructor(data: Partial<VisualPlayerData>) {
    Object.assign(this, data)
  }
}

export interface PlayerCache {
  lastSentPosition?: Point
  biome?: MapAreaName[]
  lastSentCameraPosition?: Point
  staticBios?: Bio[]
  staticSettables?: StaticSettableItem[]
  lastSentClickin?: boolean
  otherPlayers?: VisualPlayerData[]
  mobs?: Mob[]
  drops: BasicDrop[]
  miscs: Misc[]
}

export const PlayerCacheInit: () => PlayerCache = () => {
  return {
    staticBios: [],
    staticSettables: [],
    mobs: [],
    otherPlayers: [],
    biome: ['forest'],
    drops: [],
    miscs: [],
  }
}

export interface PlayerProps {
  name: string
  cameraOptions: { size: Size; map: Size }
  gameServer: GameServer
  token: Token
  lbMember: LBMember
  uniqueId: number
  clanMember: ClanMember
  skin: number
}

export type PlayerEvents = {}
