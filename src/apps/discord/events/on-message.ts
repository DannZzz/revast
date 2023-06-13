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
    let args = msg.content.split(/ +/g).map((s) => s.toLowerCase())
    const nameInArgs = MyName.find(args)
    if (!nameInArgs) return
    args = args.slice(args.indexOf(nameInArgs) + 1)

    if (args.length === 0 || args.length === 1) {
      listenBoss(client, msg)
      return
    }

    resolveDJMessage(client, msg, args)
  })
}
