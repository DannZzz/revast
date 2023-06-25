import { Items } from 'src/data/items'
import { Command, CommandArgument } from '../Command'

export default new Command('server-message', {
  aliases: ['sm'],
  args: [
    {
      desc: 'Player Id or all',
      required: true,
      validate: CommandArgument.idOrAll,
    },
  ],
  onMatch(author, [playerId, ...args]) {
    const players = author.gameServer.alivePlayers
    const msg = args.join(' ').trim()
    if (!msg) return author.serverMessage('No message provided')
    if (playerId !== 'all') {
      const p = players.get(+playerId)
      if (!p) {
        author.serverMessage('Invalid Player Id')
      } else {
        p.serverMessage(msg)
      }
    } else {
      players.forEach((p) => {
        p.serverMessage(msg)
      })
    }
  },
})
