import { NB } from 'src/utils/NumberBoolean'
import { Command, CommandArgument } from '../Command'

export default new Command('beta', {
  aliases: [],
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
      player.settings.beta(status)
      author.serverMessage(
        `${player.name} now ${status ? 'has' : "hasn't"} beta mode`,
      )
    } else {
      author.serverMessage(`Player with id ${playerId} not found`)
    }
  },
})
