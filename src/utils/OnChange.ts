import { EventEmitter } from "./EventEmitter"

export type ChangeEvented<T> = Value<T>
export const onChange = <T>(val: T) => new Value(val)

class Value<T> {
  private events = new EventEmitter<{ change: [value: T, oldValue: T] }>()
  constructor(private _value: T) {}

  get value() {
    return this._value
  }

  set value(val: T) {
    const oldVal = this._value
    this._value = val
    this.events.emit("change", val, oldVal)
  }

  onChange(cb: (value: T, oldValue: T) => void) {
    this.events.on("change", cb)
  }
}
