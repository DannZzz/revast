import { GameServer } from 'src/game/server'
import { Tick } from './Tick'
import { Gettable } from 'src/global/global'

export class RandomOnMap {
  private tick: Tick

  constructor(
    readonly gs: GameServer,
    readonly make: (this: GameServer) => void,
    readonly type: string,
    readonly max: number,
    readonly every: Gettable<number>,
  ) {
    this.tick = new Tick(every)
  }

  everySecond() {
    if (this.tick.limited()) return
    if (
      this.gs.staticItems
        .for('all')
        .drops.filter((drop) => drop.type === this.type).length >= this.max
    )
      return

    this.make.call(this.gs)
    this.tick.take()
  }
}
