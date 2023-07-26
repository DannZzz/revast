import { DJCommand } from '../Command'
import { DJGameServerInteraction } from '../collectors/game-server-interaction'
import GameServers from 'src/servers/game-servers'

export default new DJCommand({
  arguments: [
    {
      args: [
        {
          word: 'where',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 2,
          lshOptions: {},
          validAmount: 0,
        },
      ],
    },
    {
      args: [
        {
          word: 'am',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 0,
        },
      ],
      notRequired: true,
    },
    {
      args: [
        {
          word: 'i',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 0,
        },
      ],
    },
  ],

  execute({ msg, author }) {
    const serverName = DJGameServerInteraction.collectors.get(
      author.id,
    )?.currentServer
    if (!serverName) return msg.reply("Sir, you're not in any server.")
    msg.reply(
      `Wow, I found you in the server \`${
        GameServers.find(
          (s) => s.information.name.toLowerCase() === serverName?.toLowerCase(),
        ).information.name
      }\`.`,
    )
  },
})
