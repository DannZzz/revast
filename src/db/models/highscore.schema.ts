import { Exclude, Expose } from 'class-transformer'
import * as mongoose from 'mongoose'
import { Transformer } from 'src/structures/Transformer'

@Exclude()
export class HighscoreModel extends Transformer {
  _id?: string
  @Expose()
  name: string
  @Expose()
  xp: number
  // @Expose()
  sub: number
  @Expose()
  createdAt?: number
  @Expose()
  beta: boolean
  @Expose()
  days: number

  constructor(data: Highscore) {
    super()
    Object.assign(this, '_doc' in data ? data._doc : data)
  }
}

export type Highscore = Omit<HighscoreModel, keyof Transformer>

export const HighscoreSchema = new mongoose.Schema<Highscore>({
  name: String,
  xp: Number,
  sub: Number,
  createdAt: { type: Number, default: Date.now },
  beta: Boolean,
  days: Number,
})

export const Highscore = mongoose.model('highscores', HighscoreSchema)
