import { Highscore } from './models/highscore.schema'
import config from 'config'

export class DatabaseHandler {
  static registerHighscore(data: Highscore) {
    // config.util.getEnv('NODE_ENV') === 'development'
    if (data.xp <= 0) return
    const created = new Highscore(data)
    return created.save()
  }
}
