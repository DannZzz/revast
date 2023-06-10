import { Timer } from './timer'

export class Timeout extends Timer {
  constructor(public cb?: Function, public time?: number) {
    super()
  }

  callback(cb: Function): void {
    cb()
    clearTimeout(this._timer)
    this.isRunning(false)
  }

  run(): Timer {
    if (this.isRunning() || !this.cb || !this.time) return
    this.isRunning(true)
    this._timer = setTimeout(() => this.callback(this.cb), this.time)
    return this
  }
  stop(): Timer {
    clearTimeout(this._timer)
    this.isRunning(false)
    return this
  }
}
