import { GetSet } from "src/structures/GetSet";
import { PlayerState } from "../types/player.types";
import { Player } from "./player";

export class PlayerStates {
  readonly actualStates: {[k in keyof PlayerState]: GetSet<PlayerState[k]>} = {
    fire: GetSet(false),
    workbench: GetSet(false)
  }

  constructor(private player: Player) {}

  update() {
    let _fire = false  
    let _workbench = false
    const settables = this.player.cache.get("staticSettables")

    let checks = 2
    
    
    for (let settable of settables) {
      if (checks === 0) break

      // fire
      if (!_fire && settable.isSpecial("firePlace") && settable.data.special.firePlace.within.call(settable, this.player.point())) {
        _fire = true
        checks--
      }

      if (!_workbench && settable.isSpecial("workbench") && settable.data.special.workbench.within.call(settable, this.player.point())) {
        _workbench = true
        checks--
      }
      
    }

    if (_fire !== this.actualStates.fire()) this.actualStates.fire(_fire)
    if (_workbench !== this.actualStates.workbench()) this.actualStates.workbench(_workbench)
  }
}