import { Layer } from "konva/lib/Layer"
import { KonvaEventObject } from "konva/lib/Node"
import { Bio } from "../basic/bio-item.basic"
import Konva from "konva"

export interface GameProps {
  layer: Layer
  layer2: Layer
}

export interface JoinPlayer {
  name: string
  token: string
}

export type GameEvents = {
  "player.mouse-move": [mouseCursor: Point]
  "keyboard.up": [evt: KeyboardEvent]
  "keyboard.down": [evt: KeyboardEvent]
  "mouse.up": [Konva.KonvaEventObject<MouseEvent>]
  "mouse.down": [Konva.KonvaEventObject<MouseEvent>]
  "screen.resize": [size: Size]
  "dropItem.request": [itemId: number]
  "dropItem.response": [itemId: number, all: boolean]
}
