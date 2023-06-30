import { Items } from 'src/data/items'
import { Command, CommandArgument } from '../Command'
import { GAME_DAY_SECONDS } from 'src/constant'

export default new Command('add-days', {
  aliases: ['ad'],
  args: [
    {
      desc: 'Player Id or all',
      required: true,
      validate: CommandArgument.idOrAll,
    },
    {
      desc: 'Quantity (default 1)',
      required: true,
      validate: CommandArgument.number,
    },
  ],
  onMatch(author, [playerId, q = 1]) {
    const players = author.gameServer.alivePlayers

    if (playerId !== 'all') {
      const p = players.get(+playerId)
      if (!p) {
        author.serverMessage('Invalid Player Id')
      } else {
        p.settings.beta(true)
        p.createdAt = new Date(
          p.createdAt.getTime() - 1000 * GAME_DAY_SECONDS * +q,
        )
        author.serverMessage(`Days (${q}) added to ${p.name} (now ${p.days})`)
      }
    } else {
      players.forEach((p) => {
        p.settings.beta(true)
        p.createdAt = new Date(
          p.createdAt.getTime() - 1000 * GAME_DAY_SECONDS * +q,
        )
      })
      author.serverMessage(`Days (${q}) added to everyone`)
    }
  },
})
