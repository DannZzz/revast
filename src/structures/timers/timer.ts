import { GetSet } from '../GetSet'

export abstract class Timer {
  protected _timer: any
  readonly isRunning = GetSet(false)

  abstract callback(cb: Function): void
  abstract run(): Timer
  abstract stop(): Timer
}
