import { DJCommand } from '../Command'

export default new DJCommand({
  arguments: [
    {
      word: 'показать',
      ignoreNextCount: 0,
      ignoreWordIfLengthSmallerThan: 0,
      lshOptions: {},
      validAmount: 5,
    },
    {
      word: 'сервер',
      ignoreNextCount: 0,
      ignoreWordIfLengthSmallerThan: 0,
      lshOptions: {},
      validAmount: 3,
    },
  ],

  execute({ msg }) {
    msg.reply('Показываю серверы!')
  },
})
