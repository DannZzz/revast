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
      const biomeOptions = gameServer.map.find(
        gameServer.map.biomeOf(this.player.point()),
      )

      const states = this.player.actions.state.actualStates

      const wearing = this.player.items.weared?.item

      // biome effect
      sp +=
        biomeOptions?.[
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

      // in water speed change (wearing)
      if (
        wearing &&
        wearing.data.effect?.inWaterSpeed &&
        states.water() &&
        !states.onBridge()
      ) {
        sp += wearing.data.effect.inWaterSpeed
      }

      return gameServer.lastFrameDelta * sp
    })
  }
}
