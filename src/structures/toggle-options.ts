import { NumberBoolean } from '../game/types/any.types'
import { NB } from '../utils/NumberBoolean'

export type ToggleKeys = [
  up: NumberBoolean,
  down: NumberBoolean,
  right: NumberBoolean,
  left: NumberBoolean,
  clicking: NumberBoolean,
]

type ToggleOptions = 'up' | 'down' | 'left' | 'right' | 'clicking'

export class Toggle {
  private keys: ToggleKeys = [0, 0, 0, 0, 0]

  constructor() {}

  is(key: ToggleOptions): boolean {
    const indexes: Record<ToggleOptions, number> = {
      up: 0,
      down: 1,
      right: 2,
      left: 3,
      clicking: 4,
    }
    return NB.from(this.keys[indexes[key]])
  }

  set(keys: ToggleKeys) {
    this.keys = keys
  }
}
