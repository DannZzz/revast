import { Chest } from 'anytool'
import { GameServer } from 'src/game/server'
import { Clan } from './Clan'
import { ClanMember } from './ClanMember'

export class GameClans {
  readonly clans = new Chest<string, Clan>()

  constructor(readonly gameServer: GameServer) {}

  makeMember(uniqueId: number) {
    return new ClanMember(uniqueId, this)
  }
}
