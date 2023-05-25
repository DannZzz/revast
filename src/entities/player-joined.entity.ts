import { Point, Size } from 'src/global/global'
import { PlayerSkinEntity } from './player-skin.entity'
import { Type } from 'class-transformer'
import { DayInfo } from '../structures/GameDay'
import { MapEntity } from './map.entity'

export class PlayerJoinedEntity {
  @Type(() => PlayerSkinEntity)
  skin: PlayerSkinEntity
  name: string
  player: { point: Point; angle: number; speed: number }
  screen: Point

  @Type(() => MapEntity)
  map: MapEntity
  token: string
  id: string
  @Type(() => DayInfo)
  dayInfo: DayInfo

  constructor(data: PlayerJoinedEntity) {
    Object.assign(this, data)
  }
}
