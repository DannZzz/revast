import { Point, Size } from 'src/global/global'
import { MobDefaultMoveTactic } from '../game/basic/mob.basic'
import { MobNames } from '../data/mobs'
import { Mob } from '../game/mobs/mob'
import { Player } from '../game/player/player'
import { Biome, MapAreaName } from '../structures/GameMap'
import { StaticItems } from '../structures/StaticItems'
import { Exclude, Expose } from 'class-transformer'
import { AssetLink } from 'src/structures/Transformer'
import { StaticItemsHandler } from 'src/structures/StaticItemsHandler'

@Exclude()
export class MobEntity implements Partial<Mob> {
  @Expose()
  id: string

  @Expose()
  point?: Point

  @Expose()
  size: Size

  @Expose()
  get angle() {
    return (this.theta / Math.PI) * 180
  }

  @AssetLink()
  @Expose()
  get url() {
    return this.source
  }

  @AssetLink()
  @Expose()
  get hurtUrl() {
    return this.hurtSource
  }

  spawn: { startPoint: Point; size: Size }
  staticItems: StaticItemsHandler
  target?: Player
  currentArea: MapAreaName
  theta: number
  damage: number
  source: string
  hurtSource?: string
  name: MobNames
  reactRadius: number
  moveTactic: MobDefaultMoveTactic

  constructor(data: Partial<Mob>) {
    Object.assign(this, data)
  }
}
