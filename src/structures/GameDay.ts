import { GAME_DAY_SECONDS } from 'src/constant'
import { Uptime } from './Uptime'
import { Transform } from 'class-transformer';
import { NB } from '../utils/NumberBoolean';

export class DayInfo {
  thisDay: number;
  oneDayDuration: number;
  @Transform(({value}) => NB.to(value))
  isDay: boolean

  constructor(data: Partial<DayInfo>) {
    Object.assign(this, data)
  }
}

export class GameDay extends Uptime {
  readonly oneDay = GAME_DAY_SECONDS
  
  constructor(startDate: Date) {
    super(startDate)
  }

  isDay() {
    const s = this.seconds
    return s % this.oneDay < this.oneDay / 2
  }
  
  now(): DayInfo {
    return new DayInfo({
      thisDay: this.seconds % this.oneDay,
      oneDayDuration: this.oneDay,
      isDay: this.isDay()
    })
  }
}
