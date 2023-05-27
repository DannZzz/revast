import { Command, CommandArgument } from '../Command'

export default new Command('show-ids', {
  aliases: ['si'],
  args: [],
  onMatch(author) {
    const players = author.gameServer.alivePlayers
    author
      .socket()
      .emit('playerMessage', [
        author.id(),
        `${players.map((pl) => `#${pl.uniqueId} ${pl.name}`).join('\n')}`,
      ])
  },
})
