import { uuid } from 'anytool'
import Chest from 'anytool/dist/Chest'

export type LBKey = number | string

export type LBListener = (key: LBKey, newXpAmount: number) => void
export class Leaderboard {
  members: Chest<LBKey, LBMember> = new Chest()
  readonly listeners: LBListener[] = []

  addMember(key: LBKey): LBMember {
    const member = new LeaderboardMember(key, () => this)
    this.members.set(key, member)
    return member
  }

  onChange(cb: LBListener) {
    this.listeners.push(cb)
  }

  generate(): LBMember[]
  generate(limit: number): LBMember[]
  generate(limit: number = 10): LBMember[] {
    return [...this.members.sort((a, b) => b.xp - a.xp).values()].slice(
      0,
      limit,
    )
  }
}

class LeaderboardMember {
  private readonly _id = uuid(50)
  private _xp: number = 0

  constructor(readonly key: LBKey, private lb: () => Leaderboard) {}

  add(amount: number) {
    this._xp = Math.round(this._xp + amount)
    this.lb().listeners.forEach((listener) => listener(this.key, this._xp))
  }

  get xp() {
    return this._xp
  }

  delete() {
    this.lb().members.deleteMany((member) => member._id === this._id)
  }
}

export type LBMember = LeaderboardMember
