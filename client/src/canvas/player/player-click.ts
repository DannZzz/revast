import { socket } from "../../socket/socket"
import { getPointByTheta } from "../animations/rotation"
import { ResourceGetting } from "../basic/item.basic"
import { BasicPlayer } from "../basic/player.basic"
import { Player } from "./player"
import { PlayerItems } from "./player-items"

export class PlayerClick {
  canClick: boolean = true
  handClick: "right" | "left" = "right"
  clickStatus: "idle" | "pending" = "idle"
  clickCount = 0
  private readonly _toggleOnClicks = 3
  clickDuration: number

  constructor(private player: BasicPlayer) {
  }

  get toggleClicksEach() {
    const equiped = this.player.items.equiped
    if (equiped && equiped.toggleClicks) return equiped.toggleClicks
    return this._toggleOnClicks
  }
}
