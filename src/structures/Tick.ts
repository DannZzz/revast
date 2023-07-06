import { Gettable } from 'src/global/global'

export type TickOptions = {
  reversed?: boolean
}

export class Tick {
  last: number = 0

  constructor(seconds: Gettable<number>)
  constructor(seconds: Gettable<number>, options: TickOptions)
  constructor(
    readonly seconds: Gettable<number>,
    private readonly options: TickOptions = {},
  ) {
    this.take()
  }

  take() {
    this.last = Date.now() + Gettable(this.seconds) * 1000
  }

  limited() {
    return this.options.reversed
      ? this.last < Date.now()
      : this.last > Date.now()
  }
}
