import { EmbedBuilder } from 'discord.js'
import { DJCommand } from '../Command'
import { Items } from 'src/data/items'
import { SERVER_API } from 'src/constant'

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
          word: 'item',
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
          .setThumbnail(SERVER_API('/api/images/' + item.iconSource))
          .setAuthor({ name: item.data.name })

        return msg.reply({ embeds: [embed] })
      }
    }

    let text = ''

    let texts: string[] = []

    Items.sort((a, b) => a.id - b.id).forEach((item) => {
      const itemTxt = `#${item.id} ${item.data.name} **[Icon](${SERVER_API(
        '/api/images/' + item.iconSource,
      )})**\n`
      if ((text + itemTxt).length > 4096) {
        texts.push(text)
        text = ''
      }
      text += itemTxt
    })

    if (text) texts.push(text)

    embed.setAuthor({ name: 'Items' })

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
