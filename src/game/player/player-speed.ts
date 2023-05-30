import {
  BASIC_PLAYER_SPEED,
  PLAYER_DECREASE_SPEED_CLICK,
  PLAYER_DECREASE_SPEED_WEAPON,
} from 'src/constant'
import { GameServer } from '../server'
import { Player } from './player'
import { GetSet } from 'src/structures/GetSet'

export class PlayerSpeed {
  readonly current = GetSet(BASIC_PLAYER_SPEED)

  constructor(gameServer: GameServer, private player: Player) {
    this.current.pipe((speed) => {
      let sp = speed
      // biome effect
      sp +=
        gameServer.map.find(gameServer.map.biomeOf(this.player.point()))?.[
          this.player.actions.state.actualStates.onBridge()
            ? 'onBridgeEffect'
            : 'effect'
        ].speed || 0

      // weapon equiped
      if (this.player.items.equiped?.item.data.type === 'weapon')
        sp -= PLAYER_DECREASE_SPEED_WEAPON

      // clicking
      if (this.player.actions.click.clickStatus)
        sp -= PLAYER_DECREASE_SPEED_CLICK

      return gameServer.lastFrameDelta * sp
    })
  }
}
