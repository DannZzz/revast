import { Transform } from 'class-transformer'

export class PlayerInformationEntity {
  xp: number

  days: number

  constructor(data: PlayerInformationEntity) {
    Object.assign(this, data)
  }
}
