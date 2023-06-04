import { EventEmitter } from "../utils/EventEmitter"

type GetSetEvents<Type> = {
  onChange: (value: Type, oldValue: Type) => any
}

type CB<T, K extends keyof GetSetEvents<T>> = GetSetEvents<T>[K]

type PipeCB<T> = (value: T) => any

export interface GetSet<Type> {
  (): Type
  (v: Type): GetSet<Type>
  onChange(cb: CB<Type, "onChange">): void
  pipe(cb: PipeCB<Type>): void
}

export const GetSet = <Type>(val: Type): GetSet<Type> => {
  const obj = {
    val,
    events: new EventEmitter<{
      [k in keyof GetSetEvents<Type>]: Parameters<GetSetEvents<Type>[k]>
    }>(),
    pipes: [] as PipeCB<Type>[],
  }
  const fn = function (newVal?: Type) {
    if (newVal === undefined) {
      let val = obj.val
      obj.pipes.forEach((cb) => (val = cb(val)))
      return val
    }
    const old = obj.val
    obj.val = newVal
    if (obj.val !== old) obj.events.emit("onChange", newVal, old)
    return newVal
  } as any
  fn.onChange = (cb: CB<Type, "onChange">) =>
    obj.events.on("onChange", (...args: Parameters<CB<Type, "onChange">>) => {
      const ret = cb(...args)
      if (ret !== undefined) {
        obj.val = ret
      }
    })
  fn.pipe = (cb: PipeCB<Type>) => {
    obj.pipes.push(cb)
  }
  return fn
}
