import { Type } from 'class-transformer'
import { ClanMemberEntity } from './clan-member.entity'

export class ClanInformationEntity {
  @Type(() => ClanMemberEntity)
  members: ClanMemberEntity[]
  ownerId: string
  joinPrivacy: boolean
  name: string
  playerOwner: boolean

  constructor(data: ClanInformationEntity) {
    Object.assign(this, data)
  }
}
