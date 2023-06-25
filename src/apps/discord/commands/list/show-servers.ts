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
          word: 'показать',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 5,
        },
      ],
    },
    {
      args: [
        {
          word: 'сервер',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 2,
        },
      ],
    },
  ],

  execute({ msg, author }) {
    msg.reply('Нашел список серверов??')
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
              word: 'выбор',
              validAmount: 4,
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
              word: 'первый',
              validAmount: 4,
            },
            {
              ignoreNextCount: 0,
              ignoreWordIfLengthSmallerThan: 0,
              lshOptions: {},
              word: 'второй',
              validAmount: 4,
            },
            {
              ignoreNextCount: 0,
              ignoreWordIfLengthSmallerThan: 0,
              lshOptions: {},
              word: 'третий',
              validAmount: 4,
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
          case 'первый':
            index = 0
            break

          case 'второй':
            index = 1
            break

          case 'третий':
            index = 2
            break

          default:
            index = Math.ceil(+num) - 1
            break
        }
        const server: GameServer = DJGameServerInteraction.servers()[index]
        if (!server) msg.channel.send('Эуу, я такого сервера ещё не видел.')
        this.currentServer = server.information.name
        msg.channel.send(
          'Буум, вы установили сервер: ' + server.information.name,
        )
      },
    )
  },
})
