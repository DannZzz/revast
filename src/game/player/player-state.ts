import { GetSet } from 'src/structures/GetSet'
import { PlayerState } from '../types/player.types'
import { Player } from './player'
import { Biome } from 'src/structures/GameMap'
import { rectToPolygon } from 'src/utils/polygons'
import { SpecialItemTypes } from 'src/data/config-type'

export class PlayerStates {
  readonly actualStates: { [k in keyof PlayerState]: GetSet<PlayerState[k]> } =
    {
      fire: GetSet(false),
      workbench: GetSet(false),
      water: GetSet(false),
      onBridge: GetSet(false),
    }

  constructor(private player: Player) {}

  update() {
    let _fire = false
    let _workbench = false
    let _water = false
    let _onBridge = false
    const settables = this.player.cache.get('staticSettables')

    let checks = 3

    for (let settable of settables) {
      if (checks === 0) break

      // fire
      if (
        !_fire &&
        settable.isSpecial('firePlace') &&
        settable.data.special.firePlace.within.call(
          settable,
          this.player.point(),
        )
      ) {
        _fire = true
        checks--
      }
      // workbench
      if (
        !_workbench &&
        settable.isSpecial('workbench') &&
        settable.data.special.workbench.within.call(
          settable,
          this.player.point(),
        )
      ) {
        _workbench = true
        checks--
      }

      if (
        !_onBridge &&
        settable.data.type === SpecialItemTypes.bridge &&
        settable.withinStrict(this.player.point())
      ) {
        _onBridge = true
        checks--
      }
    }
    _water =
      this.player.gameServer.map.find(
        this.player.gameServer.map.biomeOf(this.player.point()),
      ).type === Biome.water

    if (_fire !== this.actualStates.fire()) this.actualStates.fire(_fire)
    if (_workbench !== this.actualStates.workbench())
      this.actualStates.workbench(_workbench)
    if (_water !== this.actualStates.water()) {
      this.actualStates.water(_water)
    }
    if (_onBridge !== this.actualStates.onBridge()) {
      this.actualStates.onBridge(_onBridge)
    }
  }
}
