import { Point, Size } from 'src/global/global'
import { PlayerSkinEntity } from './player-skin.entity'
import { Transform, Type } from 'class-transformer'
import { DayInfo } from '../structures/GameDay'
import { MapEntity } from './map.entity'
import { PlayerItemTimeout } from 'src/game/types/player.types'

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
  @Transform(({ value }) => [value.weapon, value.helmet, value.building])
  timeout: PlayerItemTimeout

  constructor(data: PlayerJoinedEntity) {
    Object.assign(this, data)
  }
}
