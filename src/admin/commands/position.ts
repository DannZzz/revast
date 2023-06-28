import { NB } from 'src/utils/NumberBoolean'
import { Command, CommandArgument } from '../Command'

export default new Command('position', {
  aliases: ['pos'],
  args: [{ validate: CommandArgument.number, desc: 'Player Id' }],
  onMatch(author, [playerId]) {
    let pId = +(playerId || author.uniqueId)
    const player = author.gameServer.alivePlayers.find(
      (player) => player.uniqueId === pId,
    )

    if (player) {
      const pos = player.point().round()
      author.serverMessage(`Position: ${pos.x} ${pos.y}`)
    } else {
      author.serverMessage(`Player with id ${playerId} not found`)
    }
  },
})
