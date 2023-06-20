import { DJCommand } from '../Command'
import { DJGameServerInteraction } from '../collectors/game-server-interaction'
import GameServers from 'src/servers/game-servers'

export default new DJCommand({
  arguments: [
    {
      args: [
        {
          word: 'где',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 0,
        },
      ],
    },
    {
      args: [
        {
          word: 'я',
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
    if (!serverName)
      return msg.reply('Сэр, вы не находитесь ни в одной сервере..')
    msg.reply(
      `Оу! Я вас нашел на сервере \`${
        GameServers.find(
          (s) => s.information.name.toLowerCase() === serverName?.toLowerCase(),
        ).information.name
      }\`.`,
    )
  },
})
