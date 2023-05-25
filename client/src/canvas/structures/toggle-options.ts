import { socket } from "../../socket/socket"
import { NB } from "../utils/NumberBoolean"

const keys = {
  up: ["arrowup", "keyw"],
  down: ["arrowdown", "keys"],
  right: ["arrowright", "keyd"],
  left: ["arrowleft", "keya"],
  clicking: ["clicking"],
}

const converter = (key: string) => {
  for (let k in keys) {
    if (keys[k].includes(key.toLowerCase())) return k
  }
  return null
}

type ToggleKey = "up" | "down" | "left" | "right" | "clicking"

export class Toggle {
  keys: $Array<ToggleKey> = $([])

  is(key: ToggleKey) {
    return this.keys.includes(key)
  }

  set(key: string, val: boolean) {
    const converted = converter(key)
    if (!converted) return
    if (val) {
      if (!this.keys.includes(converted)) {
        this.keys.push(converted)
      }
    } else {
      const index = this.keys.indexOf(converted)
      if (index !== -1) this.keys.remove(index)
    }
    socket.emit("toggles", [
      NB.to(this.is("up")),
      NB.to(this.is("down")),
      NB.to(this.is("right")),
      NB.to(this.is("left")),
      NB.to(this.is("clicking")),
    ])
  }
}
