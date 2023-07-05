import { ClanMember } from 'src/structures/clans/ClanMember'
import { Player } from './player'
import { Transformer } from 'src/structures/Transformer'
import { ClanVisualInformationEntity } from 'src/entities/clan-visual-information.entity'
import { ClanMemberEntity } from 'src/entities/clan-member.entity'
import { ClanInformationEntity } from 'src/entities/clan-information.entity'
import { timer } from 'rxjs'
import { CLAN_MAX_NAME_SIZE } from 'src/constant'

export class PLayerClanActions {
  cm: ClanMember
  constructor(readonly player: Player) {
    this.cm = player.clanMember
  }

  showInfo() {
    if (!this.cm.clanId) {
      const clans = this.player.gameServer.clans.clans
        .filter((clan) => clan.openForApps)
        .map((clan) =>
          Transformer.toPlain(
            new ClanVisualInformationEntity({
              id: clan.id,
              joinable: !clan.isFull(),
              name: clan.name,
              memberCount: clan.members.size,
            }),
          ),
        )
      this.player.socket().emit('clansInformation', [clans])
    } else {
      const clan = this.cm.my()
      this.player.socket().emit('clansInformation', [
        undefined,
        Transformer.toPlain(
          new ClanInformationEntity({
            joinPrivacy: clan.openForApps,
            ownerId: clan.owner.player.id(),
            name: clan.name,
            playerOwner: this.player.uniqueId === clan.owner.playerId,
            members: clan.members.map((member) => {
              return new ClanMemberEntity({
                owner: member.playerId === clan.owner.playerId,
                id: member.player.id(),
                name: member.player.name,
                kickable:
                  clan.owner.playerId === this.player.uniqueId &&
                  member.playerId !== this.player.uniqueId,
              })
            }),
          }),
        ),
      ])
    }
  }

  create(name: string) {
    if (!this.cm.make(name?.slice?.(0, CLAN_MAX_NAME_SIZE) || 'clan')) return
    this.showInfo()
    this.player.sendIcons()
  }

  join(clanId: string) {
    if (this.cm.clanId) return
    const clan = this.player.gameServer.clans.clans.get(clanId)
    if (!clan || clan.isFull() || !clan.openForApps) return
    timer(20000).subscribe(() => clan?.applications?.delete(this.player?.id()))
    if (clan.applications.has(this.player.id())) return
    clan.applications.add(this.player.id())
    clan.owner.player
      .socket()
      .emit('clanJoinApplication', [this.player.name, this.player.id()])
  }

  acceptMember(memberId: string) {
    if (!this.amIOwner()) return
    const player = this.player.gameServer.alivePlayers.find(
      (p) => p.id() === memberId,
    )
    if (player && !player.clanMember.clanId) {
      player.clanMember.join(this.cm.clanId, () => {
        this.cm.my().sendAll()
        this.cm
          .my()
          .members.forEach((member) =>
            member.player.serverMessage(`${player.name} has joined to clan.`),
          )
      })
      player.sendIcons()
    }
  }

  togglePrivacy() {
    if (!this.amIOwner()) return
    this.cm.my().toggleAppsPrivacy()
    this.cm.my().sendAll()
  }

  amIOwner() {
    return this.cm.my()?.owner.playerId === this.player.uniqueId
  }

  kick(memberId: string) {
    if (!this.amIOwner()) return
    const player = this.player.gameServer.alivePlayers.find(
      (p) => p.id() === memberId,
    )
    if (player) {
      this.cm.my().removeMember(player.uniqueId, () => {
        player.clanActions.showInfo()
        this.cm.my().sendAll()
        this.cm
          .my()
          .members.forEach((member) =>
            member.player.serverMessage(`${player.name} was kicked from clan.`),
          )
      })
      player.sendIcons()
    }
  }

  leave() {
    if (!this.cm.clanId) return
    this.cm.leave()
    this.player.sendIcons()
  }
}
