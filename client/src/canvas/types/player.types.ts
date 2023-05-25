import { DayInfo } from "../../socket/events"
import { Item } from "../basic/item.basic"
import { Game } from "../game"
import { Camera } from "../structures/Camera"

export type PlayerSkinName = "basic"

export class PlayerSkin {
  name: PlayerSkinName
  handUrl: string
  url: string

  constructor(data: PlayerSkin) {
    Object.assign(this, data)
  }
}

export interface PlayerProps {
  name: string
  skin: PlayerSkin
  camera: Camera
  dayInfo: DayInfo
  id: string
  game: () => Game
}

export type PlayerEvents = {
  "set.angle": [angle: number]
  "keyboard.up": [evt: KeyboardEvent]
  "keyboard.down": [evt: KeyboardEvent]
  "request.click": [click: boolean]
  "screen.resize": [size: Size]
}
