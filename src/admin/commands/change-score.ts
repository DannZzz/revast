import { formatNumber } from 'anytool'
import { Command, CommandArgument } from '../Command'

export default new Command('change-score', {
  aliases: ['cs', 'give-score', 'gs'],
  args: [
    {
      desc: 'Player Id',
      required: true,
      validate: CommandArgument.number,
    },
    {
      desc: 'Score',
      required: true,
      validate: CommandArgument.number,
    },
  ],
  onMatch(author, [playerId, score]) {
    const players = author.gameServer().alivePlayers

    const target = players.get(+playerId)
    if (!target) return author.serverMessage('Invalid Player Id')

    if (target.lbMember.xp + +score < 0) {
      target.lbMember.add(-target.lbMember.xp)
    } else {
      target.lbMember.add(+score)
    }

    author.serverMessage(`${formatNumber(score)} xp added to ${target.name}!`)
  },
})
