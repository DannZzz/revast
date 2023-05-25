import { Command, CommandArgument } from '../Command'
import { Player } from 'src/game/player/player'

export default new Command('teleport-player-here', {
  aliases: ['tphere'],
  args: [
    {
      desc: 'Player Id or all',
      required: true,
      validate: CommandArgument.idOrAll,
    },
  ],
  onMatch(author, [playerId]) {
    const players = author.gameServer().alivePlayers
    const selectedPlayers: Player[] = []
    if (playerId === 'all') {
      selectedPlayers.push(...players.values())
    } else {
      const p = players.get(+playerId)
      if (!p) return author.serverMessage('Invalid Player Id or Item Id')
      selectedPlayers.push(p)
    }

    selectedPlayers.forEach((player) => player.moveTo(author.point().clone()))
  },
})
