import { Highscore } from './models/highscore.schema'
import config from 'config'

export class DatabaseHandler {
  static registerHighscore(data: Highscore) {
    // config.util.getEnv('NODE_ENV') === 'development'
    if (data.xp <= 0 || config.util.getEnv('NODE_ENV') === 'development') return
    const created = new Highscore(data)

    created.save().catch(console.log)
  }
}
