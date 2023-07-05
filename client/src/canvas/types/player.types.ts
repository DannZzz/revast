import { DayInfo, PlayerJoinedDto } from "../../socket/events"
import { Item } from "../basic/item.basic"
import { Game } from "../game"
import { Camera } from "../structures/Camera"

export type PlayerSkinName = string

export class PlayerSkin {
  name: PlayerSkinName
  handUrl: string
  url: string
  index: number

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
  icons: number[]
  game: () => Game
  timeout: PlayerJoinedDto["timeout"]
}

export type PlayerEvents = {
  "set.angle": [angle: number]
  "keyboard.up": [evt: KeyboardEvent]
  "keyboard.down": [evt: KeyboardEvent]
  "request.click": [click: boolean]
  "screen.resize": [size: Size]
}
