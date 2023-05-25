export class LeaderboardMemberEntity {
  name: string
  xp: number

  constructor(data: LeaderboardMemberEntity) {
    Object.assign(this, data)
  }
}
