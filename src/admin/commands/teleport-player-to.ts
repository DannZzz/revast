import { Command, CommandArgument } from '../Command'
import { Player } from 'src/game/player/player'

export default new Command('teleport-player-to', {
  aliases: ['tpto', 'tpt'],
  args: [
    {
      desc: 'Target Id or all',
      required: true,
      validate: CommandArgument.idOrAll,
    },
    {
      desc: 'Player Id',
      required: true,
      validate: CommandArgument.number,
    },
  ],
  onMatch(author, [target, playerId]) {
    const players = author.gameServer.alivePlayers

    const to = players.get(+playerId)?.point().clone()
    if (!to) return author.serverMessage('Invalid Player Id')

    const selectedPlayers: Player[] = []
    if (target === 'all') {
      selectedPlayers.push(...players.values())
    } else {
      const p = players.get(+target)
      if (!p) return author.serverMessage('Invalid Target Id')
      selectedPlayers.push(p)
    }

    selectedPlayers.forEach((player) => player.moveTo(to.clone()))
  },
})
