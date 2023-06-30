import { AttachmentBuilder, EmbedBuilder } from 'discord.js'
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
          word: 'вид',
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
          word: (id) => !isNaN(+id),
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 3,
        },
      ],
      query: 'id',
    },
  ],

  execute({ msg, author, query }) {
    let playerId = +query.get('id')

    const serverName = DJGameServerInteraction.collectors.get(
      author.id,
    )?.currentServer

    if (!serverName)
      return msg.reply(
        'Эй, я не могу читать твои мысли, подключись к серверу, либо добавь еще и название/номер сервера, чтобы я понял..',
      )

    const server = GameServers.find(
      (s) => s.information.name.toLowerCase() === serverName?.toLowerCase(),
    )

    if (!server)
      return msg.reply('Эу, кажется такого сервера не существует :thinking:')

    const player = server.alivePlayers.get(playerId)
    if (!player || !player.online())
      return msg.reply('Эу, я не нашел игрока, либо игрок оффлайн :thinking:')
    msg.reply('Подождите пожалуйста!')
    player.requestView((dataUrl) => {
      const attachment = new AttachmentBuilder(
        Buffer.from(dataUrl.split(',')[1], 'base64'),
        {
          name: 'view.png',
        },
      )
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Player: ${player.name}` })
        .setColor('White')
        .setImage('attachment://view.png')
      msg.reply({ embeds: [embed], files: [attachment] }).catch(() => {})
    })
  },
})
