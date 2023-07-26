import { EmbedBuilder } from 'discord.js'
import { DJCommand } from '../Command'
import GameServers from 'src/servers/game-servers'
import { DJGameServerInteraction } from '../collectors/game-server-interaction'
import { GameServer } from 'src/game/server'

export default new DJCommand({
  arguments: [
    {
      args: [
        {
          word: 'show',
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
          word: 'server',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 2,
        },
      ],
    },
  ],

  execute({ msg, author }) {
    msg.reply('Server list found!!')
    const embed = new EmbedBuilder()
      .setDescription(
        DJGameServerInteraction.servers()
          .map(
            (server, i) =>
              `${i + 1}. ${server.information.name} (${
                server.alivePlayers.size
              } players)`,
          )
          .join('\n'),
      )
      .setColor('White')

    msg.channel.send({ embeds: [embed] })
    DJGameServerInteraction.expect(
      author.id,
      [
        {
          args: [
            {
              ignoreNextCount: 0,
              ignoreWordIfLengthSmallerThan: 3,
              lshOptions: {},
              word: 'select',
              validAmount: 2,
            },
          ],
          notRequired: true,
        },
        {
          args: [
            {
              ignoreNextCount: 0,
              ignoreWordIfLengthSmallerThan: 0,
              lshOptions: {},
              word: 'first',
              validAmount: 2,
            },
            {
              ignoreNextCount: 0,
              ignoreWordIfLengthSmallerThan: 0,
              lshOptions: {},
              word: 'second',
              validAmount: 2,
            },
            {
              ignoreNextCount: 0,
              ignoreWordIfLengthSmallerThan: 0,
              lshOptions: {},
              word: 'third',
              validAmount: 2,
            },
            {
              ignoreNextCount: 0,
              ignoreWordIfLengthSmallerThan: 0,
              lshOptions: {},
              word: (arg: string) => !isNaN(+arg),
              validAmount: 2,
            },
          ],
        },
      ],
      function (msg, { args, acceptedArgs }) {
        this.expects = null
        const [select, num] = acceptedArgs
        let index: number
        switch (num) {
          case 'first':
            index = 0
            break

          case 'second':
            index = 1
            break

          case 'third':
            index = 2
            break

          default:
            index = Math.ceil(+num) - 1
            break
        }
        const server: GameServer = DJGameServerInteraction.servers()[index]
        if (!server)
          msg.channel.send(
            "Eh, it seems such a server doesn't exist :thinking:",
          )
        this.currentServer = server.information.name
        msg.channel.send(
          'Boom, you are in the server: ' + server.information.name,
        )
      },
    )
  },
})
