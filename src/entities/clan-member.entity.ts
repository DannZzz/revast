export class ClanMemberEntity {
  name: string
  id: string
  kickable: boolean
  owner: boolean

  constructor(data: ClanMemberEntity) {
    Object.assign(this, data)
  }
}
