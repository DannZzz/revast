import { Client } from 'discord.js'
import { resolveDJMessage } from '../commands/Resolver'
import {
  ListenBossCollectors,
  listenBoss,
} from '../commands/collectors/listen-boss'
import { MyName } from '../utils/my-name'

export const onDiscordMessage = (client: Client) => {
  client.on('messageCreate', (msg) => {
    if (ListenBossCollectors.has(msg.author.id)) return

    if (!msg.content || msg.author.bot) return
    let args = msg.content.split(/ +/g)
    const nameInArgs = MyName.find(args.map((s) => s.toLowerCase()))
    const last = args.at(-1)
    if ((!nameInArgs && !last.endsWith('??')) || last[last.length - 3] === '?')
      return

    listenBoss(client, msg, nameInArgs, args)
  })
}
