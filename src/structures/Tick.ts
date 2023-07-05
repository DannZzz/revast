import { Gettable } from 'src/global/global'

export class Tick {
  last: number = 0

  constructor(readonly seconds: Gettable<number>) {
    this.take()
  }

  take() {
    this.last = Date.now() + Gettable(this.seconds) * 1000
  }

  limited() {
    return this.last > Date.now()
  }
}
