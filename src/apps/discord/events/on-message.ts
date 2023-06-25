import { ChannelType, Client, PermissionsBitField } from 'discord.js'
import { resolveDJMessage } from '../commands/Resolver'
import {
  ListenBossCollectors,
  listenBoss,
} from '../commands/collectors/listen-boss'
import { MyName } from '../utils/my-name'
import { splitDiscordMessageContent } from '../utils/split-message-content'

export const onDiscordMessage = (client: Client) => {
  client.on('messageCreate', (msg) => {
    if (ListenBossCollectors.has(msg.author.id)) return

    const channel = msg.channel
    if (
      !msg.content ||
      msg.author.bot ||
      !MyName.users.includes(msg.author.id) ||
      channel.type !== ChannelType.GuildText ||
      !channel
        .permissionsFor(channel.guild.members.me)
        .has(PermissionsBitField.Flags.SendMessages)
    )
      return

    let args = splitDiscordMessageContent(msg.content)
    const nameInArgs = MyName.find(args.map((s) => s.toLowerCase()))
    const last = args.at(-1)
    if ((!nameInArgs && !last.endsWith('??')) || last[last.length - 3] === '?')
      return

    listenBoss(client, msg, nameInArgs, args)
  })
}
