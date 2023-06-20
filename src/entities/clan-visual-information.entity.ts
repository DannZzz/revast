import { Transform } from 'class-transformer'
import { CLAN_MAX_MEMBERS_SIZE } from 'src/constant'

export class ClanVisualInformationEntity {
  name: string
  joinable: boolean
  id: string
  @Transform(({ value }) => `${value}/${CLAN_MAX_MEMBERS_SIZE}`)
  memberCount: number

  constructor(data: ClanVisualInformationEntity) {
    Object.assign(this, data)
  }
}
