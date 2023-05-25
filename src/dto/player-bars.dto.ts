import { PlayerBar } from '../game/player/player-bars'

export class PlayerBarsEntity {
  bar: PlayerBar
  max: number
  current: number

  constructor(data: Partial<PlayerBarsEntity>) {
    Object.assign(this, data)
  }
}
