import { Type } from 'class-transformer'
import { VisualPlayerData } from '../game/types/player.types'

export class OtherPlayersEntity {
  @Type(() => VisualPlayerData)
  players: VisualPlayerData[]
  toRemoveIds: string[]

  constructor(data: Partial<OtherPlayersEntity>) {
    Object.assign(this, data)
  }
}
