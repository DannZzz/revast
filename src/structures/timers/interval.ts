import { Timer } from './timer'

export class Interval extends Timer {
  constructor(private cb: Function, readonly time: number) {
    super()
  }

  callback(cb: Function): void {
    cb()
  }

  run(): Timer {
    if (this.isRunning() || !this.cb || !this.time) return
    this.isRunning(true)
    this._timer = setInterval(() => this.callback(this.cb), this.time)
    return this
  }
  stop(): Timer {
    clearTimeout(this._timer)
    this.isRunning(false)
    return this
  }
}
