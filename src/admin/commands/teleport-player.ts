import { Command, CommandArgument } from '../Command'
import { Player } from 'src/game/player/player'
import { Point } from 'src/global/global'

export default new Command('teleport-player', {
  aliases: ['tp'],
  args: [
    {
      desc: 'Player Id or all',
      required: true,
      validate: CommandArgument.idOrAll,
    },
    {
      desc: 'X coordinate',
      required: true,
      validate: CommandArgument.number,
    },
    {
      desc: 'Y coordinate',
      required: true,
      validate: CommandArgument.number,
    },
  ],
  onMatch(author, [playerId, x, y]) {
    const players = author.gameServer.alivePlayers
    const selectedPlayers: Player[] = []
    if (playerId === 'all') {
      selectedPlayers.push(...players.values())
    } else {
      const p = players.get(+playerId)
      if (!p) return author.serverMessage('Invalid Player Id or Item Id')
      selectedPlayers.push(p)
    }

    const map = author.gameServer.map.absoluteSize

    const pos = new Point(+x, +y)
    if (pos.x < 0 || pos.x > map.width || pos.y < 0 || pos.y > map.height)
      return author.serverMessage('Invalid Position!')

    selectedPlayers.forEach((player) => player.moveTo(pos))
  },
})
