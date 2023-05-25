import { NumberBoolean } from 'src/game/types/any.types'

export class NB {
  static to(val: any): NumberBoolean {
    return val ? 1 : 0
  }

  static from(nb: NumberBoolean) {
    return !!nb
  }
}
