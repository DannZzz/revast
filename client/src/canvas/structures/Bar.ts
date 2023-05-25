import { uuid } from "anytool"
import { EventEmitter } from "../utils/EventEmitter"

type BarEvents = {
  change: [value: number, oldValue: number]
}

export class Bar {
  private _value: number
  readonly max: number
  readonly events = new EventEmitter<BarEvents>()
  readonly id = uuid(30)

  constructor(max: number, currentValue: number) {
    this.max = max
    this._value = currentValue
  }

  get value() {
    return this._value
  }

  set value(val: number) {
    const old = this._value
    if (val < 0) {
      this._value = 0
    } else if (val > this.max) {
      this._value = this.max
    } else {
      this._value = val
    }
    this.events.emit("change", this._value, old)
  }
}
