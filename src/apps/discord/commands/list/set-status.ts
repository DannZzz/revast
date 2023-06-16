import { ActivityType } from 'discord.js'
import { DJCommand } from '../Command'

export default new DJCommand({
  admin: true,
  arguments: [
    {
      args: [
        {
          word: 'поставить',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 3,
        },
        {
          word: 'ставить',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: {},
          validAmount: 3,
        },
      ],
    },
    {
      args: [
        {
          word: 'статус',
          ignoreNextCount: 0,
          ignoreWordIfLengthSmallerThan: 0,
          lshOptions: { remove: 0, replaceCase: 0 },
          validAmount: 0,
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
      query: 'status',
    },
  ],

  execute({ msg, author, query, client }) {
    let status: string = query.get('status')

    client.user.setActivity(status)
    msg.reply('Сделано!')
  },
})
