import { Chest, uuid } from 'anytool'
import { Player } from 'src/game/player/player'
import { ClanMember } from './ClanMember'
import { uniqueId } from 'src/utils/uniqueId'

export class Clan {
  readonly id = uniqueId()
  readonly maxMembers = 9
  readonly members = new Chest<number, ClanMember>()
  openForApps = true
  applications = new Set<string>()

  constructor(readonly name: string, readonly owner: ClanMember) {
    this.members.set(owner.playerId, owner)
  }

  isFull() {
    return this.members.size === this.maxMembers
  }

  sendAll() {
    this.members.forEach((member) => member.player.clanActions.showInfo())
  }

  addMember(member: ClanMember, cb?: () => void) {
    if (this.isFull() || !this.openForApps) return
    if (this.members.has(member.playerId)) return
    this.members.set(member.playerId, member)
    member.clanId = this.id
    cb?.()
  }

  removeMember(targetId: number, cb?: () => void) {
    if (!this.members.has(targetId) || this.owner.playerId === targetId) return
    this.members.get(targetId).clanId = null
    this.members.delete(targetId)
    cb?.()
  }

  toggleAppsPrivacy() {
    this.openForApps = !this.openForApps
  }

  delete() {
    const members = [...this.members.values()]
    this.members.forEach((member) => {
      member.player.serverMessage('The Leader left.')
      member.leave(true)
    })
    this.owner.player.gameServer.clans.clans.delete(this.id)
    members.forEach((member) => {
      member.player.clanActions.showInfo()
      member.player.sendIcons()
    })
  }
}
