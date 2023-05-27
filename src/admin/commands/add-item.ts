import { Items } from 'src/data/items'
import { Command, CommandArgument } from '../Command'

export default new Command('add-item', {
  aliases: ['ai', 'give-item', 'gi'],
  args: [
    {
      desc: 'Player Id or all',
      required: true,
      validate: CommandArgument.idOrAll,
    },
    {
      desc: 'Item Id',
      required: true,
      validate: CommandArgument.number,
    },
    {
      desc: 'Quantity (default 1)',
      validate: CommandArgument.number,
    },
  ],
  onMatch(author, [playerId, itemId, q = 1]) {
    const players = author.gameServer.alivePlayers
    const item = Items.get(+itemId)
    if (!item) return author.serverMessage('Invalid Item Id')
    if (playerId !== 'all') {
      const p = players.get(+playerId)
      if (!p) {
        author.serverMessage('Invalid Player Id')
      } else {
        p.items.addItem(+itemId, +q)
        author.serverMessage(`${item.data.name} (${q}) added to ${p.name}`)
      }
    } else {
      players.forEach((p) => p.items.addItem(+itemId, +q))
      author.serverMessage(`${item.data.name} (${q}) added to everyone`)
    }
  },
})
