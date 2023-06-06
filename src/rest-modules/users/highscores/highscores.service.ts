import { Injectable } from '@nestjs/common'
import { FilterQuery } from 'mongoose'
import { ONE_DAY_MS } from 'src/constant'
import { Highscore } from 'src/db/models/highscore.schema'

export enum HighscoreFilterDateOptions {
  LAST_DAY = 'last-day',
  ALL_TIME = 'all-time',
}

export enum HighscoreFilterTypeOptions {
  DAYS = 'days',
  XP = 'xp',
}

@Injectable()
export class HighscoresService {
  findHighscore(playerName: string): Promise<Highscore> {
    return Highscore.findOne({ name: playerName })
  }

  async findAllHighscores(options: {
    beta: boolean
    date: HighscoreFilterDateOptions
    type: HighscoreFilterTypeOptions
  }): Promise<Highscore[]> {
    const { beta, date, type } = options
    let filter: FilterQuery<Highscore> = {
      beta,

      ...(date === HighscoreFilterDateOptions.LAST_DAY && {
        createdAt: { $gte: Date.now() - ONE_DAY_MS },
      }),
    }
    return Highscore.find(filter)
      .sort(type === HighscoreFilterTypeOptions.XP ? { xp: -1 } : { days: -1 })
      .limit(100)
      .exec()
  }
}
