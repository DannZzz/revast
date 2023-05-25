import { uuid } from 'anytool'
import { GetSet } from './GetSet'

type BarEvents = {
  change: [value: number, oldValue: number]
}

export class Bar {
  private _value: GetSet<number>
  readonly max: number
  readonly id = uuid(30)

  constructor(max: number, currentValue: number) {
    this.max = max
    this._value = GetSet(currentValue)
  }

  get value() {
    return this._value()
  }

  set value(val: number) {
    const old = this._value
    let _value: number
    if (val < 0) {
      _value = 0
    } else if (val > this.max) {
      _value = this.max
    } else {
      _value = val
    }
    this._value(_value)
  }

  onChange(cb: (value: number, oldValue: number) => any) {
    this._value.onChange(cb)
  }
}
