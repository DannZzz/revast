import { Player } from 'src/game/player/player'
import { DJCommand } from '../Command'
import { DJGameServerInteraction } from '../collectors/game-server-interaction'
import { GetSet } from 'src/structures/GetSet'
import { Point } from 'src/global/global'
import { perfectSocket } from 'src/utils/perfectSocket'
import GameServers from 'src/servers/game-servers'
import AdminCommands from 'src/admin/admin-commands'

export default new DJCommand({
  admin: true,
  arguments: [
    {
      args: [
        {
          word: 'прими',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 1,
        },
        {
          word: 'применить',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 3,
        },
      ],
      notRequired: true,
    },
    {
      args: [
        {
          word: 'команда',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 1,
        },
      ],
    },
    {
      args: [
        {
          word: (arg) => true,
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 0,
        },
      ],
      query: 'command',
    },
  ],

  execute({ msg, author, query }) {
    const serverName = DJGameServerInteraction.collectors.get(
      author.id,
    )?.currentServer
    if (!serverName)
      return msg.reply('Сэр, вы же не находитесь ни в одной сервере..')
    let command: string = query.get('command')

    const fake_player = <Partial<Player>>{
      serverMessage: (content: string) =>
        msg.channel.send(`Ответ от сервера: \`${content}\``),
      point: GetSet(new Point()),
      socket: perfectSocket(<any>{}),
      gameServer: GameServers.find(
        (s) => s.information.name.toLowerCase() === serverName?.toLowerCase(),
      ),
    }
    msg.reply('Сделано!')
    AdminCommands.tryAny(`/${command}`, fake_player as Player)
  },
})
