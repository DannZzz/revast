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
          word: 'take',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 1,
        },
      ],
      notRequired: true,
    },
    {
      args: [
        {
          word: 'a',
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
          word: 'command',
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
    if (!serverName) return msg.reply("Sir, you're not in any server.")
    let command: string = query.get('command')

    const fake_player = <Partial<Player>>{
      serverMessage: (content: string) =>
        msg.channel.send(`Server Response: \`${content}\``),
      point: GetSet(new Point()),
      socket: perfectSocket(<any>{}),
      gameServer: GameServers.find(
        (s) => s.information.name.toLowerCase() === serverName?.toLowerCase(),
      ),
    }
    msg.reply('Done!')
    AdminCommands.tryAny(`/${command}`, fake_player as Player)
  },
})
