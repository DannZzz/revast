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
          word: 'show',
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
          word: 'view',
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
        "Hey, I can't read your mind, connect to the server, or add the server name/number tho, so I understand...",
      )

    const server = GameServers.find(
      (s) => s.information.name.toLowerCase() === serverName?.toLowerCase(),
    )

    if (!server)
      return msg.reply("Eh, it seems such a server doesn't exist :thinking:")

    const player = server.alivePlayers.get(playerId)
    if (!player || !player.online())
      return msg.reply(
        "Uh, I can't find the player, or the player is offline. :thinking:",
      )
    msg.reply('Wait please!')
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
