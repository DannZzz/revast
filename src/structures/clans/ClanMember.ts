import { GameClans } from './GameClans'
import { Clan } from './Clan'

export class ClanMember {
  constructor(readonly playerId: number, private gameClans: GameClans) {}
  clanId: string = null

  get player() {
    return this.gameClans.gameServer.alivePlayers.get(this.playerId)
  }

  my(): Clan {
    return this.gameClans.clans.get(this.clanId) || null
  }

  join(clanId: string, cb?: () => void) {
    if (this.clanId) return
    const clan = this.gameClans.clans.get(clanId)
    if (!clan) return
    clan.addMember(this, () => {
      cb?.()
    })
  }

  leave(force: boolean = false) {
    if (!this.clanId) return
    const clan = this.my()
    if (!force && clan.owner.playerId === this.playerId) {
      clan.delete()
      return
    }
    clan.members.delete(this.playerId)
    this.clanId = null
    if (force) return
    this.player.serverMessage('You left the clan.')
    this.player.clanActions.showInfo()
    clan.sendAll()
    clan.members.forEach((member) =>
      member.player.serverMessage(`${this.player.name} left the clan.`),
    )
  }

  make(name: string) {
    if (!name) name = ''
    name = name.replace(/[<>]/g, '')
    if (this.clanId) return false
    const clan = new Clan(name, this)
    this.gameClans.clans.set(clan.id, clan)
    this.clanId = clan.id
    return true
  }

  team(): ClanMember[] {
    if (this.clanId) return [...this.my().members.values()]
    return [this]
  }
}
