import { EmbedBuilder } from 'discord.js'
import { DJCommand } from '../Command'
import GameServers from 'src/servers/game-servers'
import { DJGameServerInteraction } from '../collectors/game-server-interaction'
import { GameServer } from 'src/game/server'
import { isNumber } from 'src/utils/is-number-in-range'
import { Cooldown, formatNumber } from 'anytool'

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
          word: 'игрок',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: { remove: 0, replaceCase: 0 },
          validAmount: 2,
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
          validAmount: 3,
        },
      ],
      notRequired: true,
    },
    {
      args: [
        {
          word: (arg) => arg.length > 3,
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 0,
        },
      ],
      notRequired: true,
      query: 'server-name',
    },
  ],

  execute({ msg, author, query }) {
    let serverName: string = query.has('server-name')
      ? query.get('server-name')
      : DJGameServerInteraction.collectors.get(author.id)?.currentServer

    if (!serverName)
      return msg.reply(
        'Эй, я не могу читать твои мысли, подключись к серверу, либо добавь еще и название/номер сервера, чтобы я понял..',
      )

    const isIndex = isNumber(+serverName)
    if (isIndex)
      serverName =
        DJGameServerInteraction.servers()[+serverName - 1]?.information.name

    const server = GameServers.find(
      (s) => s.information.name.toLowerCase() === serverName?.toLowerCase(),
    )

    if (!server)
      return msg.reply('Эу, кажется такого сервера не существует :thinking:')

    const lb = server.leaderboard.generate(100)
    const embed = new EmbedBuilder()
      .setColor('White')
      .setAuthor({
        name: `Эйй Я нашел игроков сервера ${server.information.name}!`,
      })
      .setDescription(
        lb.length === 0
          ? 'Упс, кажется никого нет..'
          : lb
              .map((lbm) => {
                const player = server.alivePlayers.get(lbm.key as number)
                return `**#${player.uniqueId}** ${player.name} - ${formatNumber(
                  lbm.xp,
                )} xp`
              })
              .join('\n'),
      )

    msg.reply({ embeds: [embed] })
  },
})
