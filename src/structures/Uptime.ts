export class Uptime {
  constructor(public date: Date) {}

  get milliseconds() {
    const time = this.date.getTime()
    const now = Date.now()
    return Math.floor(now - time)
  }

  get seconds() {
    const time = this.date.getTime()
    const now = Date.now()
    return Math.floor((now - time) / 1000)
  }
}
