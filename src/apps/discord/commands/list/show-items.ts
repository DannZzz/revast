import { EmbedBuilder } from 'discord.js'
import { DJCommand } from '../Command'
import GameServers from 'src/servers/game-servers'
import { DJGameServerInteraction } from '../collectors/game-server-interaction'
import { GameServer } from 'src/game/server'
import { isNumber } from 'src/utils/is-number-in-range'
import { Cooldown, formatNumber } from 'anytool'
import { Items } from 'src/data/items'
import { SERVER_API } from 'src/constant'

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
          word: 'предмет',
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
          word: (arg) => arg.length > 3,
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 0,
        },
      ],
      notRequired: true,
      query: 'item',
    },
  ],

  execute({ msg, author, query }) {
    let itemName: string = query.has('item') ? query.get('item') : 'all'

    const embed = new EmbedBuilder().setColor('White')

    if (itemName) {
      const item = Items.find(
        (it) =>
          it.data.name?.toLowerCase().split(' ').join('-') ===
          itemName.toLowerCase(),
      )
      if (item) {
        embed
          .setThumbnail(SERVER_API('/api/assets/' + item.iconSource))
          .setAuthor({ name: item.data.name })

        return msg.reply({ embeds: [embed] })
      }
    }

    let text = ''

    let texts: string[] = []

    Items.sort((a, b) => a.id - b.id).forEach((item) => {
      const itemTxt = `#${item.id} ${
        item.data.name
      } **[Посмотреть иконку](${SERVER_API(
        '/api/assets/' + item.iconSource,
      )})**\n`
      if ((text + itemTxt).length > 4096) {
        texts.push(text)
        text = ''
      }
      text += itemTxt
    })

    if (text) texts.push(text)

    embed.setAuthor({ name: 'Предметы' })

    msg.reply({
      embeds: [embed],
    })
    texts.forEach((txt) => {
      msg.channel.send({
        embeds: [new EmbedBuilder().setColor('White').setDescription(txt)],
      })
    })
  },
})
