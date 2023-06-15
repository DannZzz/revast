import { Chest } from 'anytool'
import { Client, Message, MessageCollector } from 'discord.js'
import { resolveDJMessage } from '../Resolver'
import { randomImListening } from '../../utils/random-answer'

interface ListenBossData {
  stoped: boolean
  collector: MessageCollector
}

export const ListenBossCollectors = new Chest<string, ListenBossData>()

export const listenBoss = (
  client: Client,
  msg: Message,
  name: string,
  args: string[],
) => {
  const author = msg.author
  if (ListenBossCollectors.has(author.id)) return msg.reply(randomImListening())

  const coll = msg.channel.createMessageCollector({
    filter: (m) => m.author.id === msg.author.id && !!m.content,
    time: 2 * 30000,
  })

  // args = args.slice(args.indexOf(name))
  const data = <ListenBossData>{ stoped: false, collector: coll }
  ListenBossCollectors.set(msg.author.id, data)
  resolveDJMessage(client, msg, args)
  coll.on('collect', (_msg) => {
    if (!_msg.content || _msg.content?.startsWith('_')) return
    const args = _msg.content?.split(/ +/g).map((msg) => msg.toLowerCase())
    coll.resetTimer()
    resolveDJMessage(client, _msg, args)
  })

  coll.on('end', () => {
    ListenBossCollectors.delete(msg.author.id)
  })
}
