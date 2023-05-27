import { NB } from 'src/utils/NumberBoolean'
import { Command, CommandArgument } from '../Command'

export default new Command('godmode', {
  aliases: ['gm'],
  args: [
    { required: true, validate: CommandArgument.number, desc: 'Player Id' },
    {
      required: true,
      validate: (val) => val == '0' || val == '1',
      desc: 'Status: 1 enabled, 0 disabled',
    },
  ],
  onMatch(author, [playerId, statusString]) {
    const status = NB.from(+statusString as any)

    const player = author.gameServer.alivePlayers.find(
      (player) => player.uniqueId === +playerId,
    )

    if (player) {
      player?.godMode(status)
      author.serverMessage(
        `${player.name} now ${status ? 'has' : "hasn't"} God Mode`,
      )
    } else {
      author.serverMessage(`Player with id ${playerId} not found`)
    }
  },
})
