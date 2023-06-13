import { EmbedBuilder } from 'discord.js'
import { DJCommand } from '../Command'
import GameServers from 'src/servers/game-servers'

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
    msg.reply('Нашел список серверов, какую выберите??')
    const embed = new EmbedBuilder()
      .setDescription(
        [...GameServers.values()]
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
  },
})
