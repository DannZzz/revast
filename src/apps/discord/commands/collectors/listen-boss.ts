import { Chest } from 'anytool'
import { Client, Message, MessageCollector } from 'discord.js'
import { resolveDJMessage } from '../Resolver'

interface ListenBossData {
  stoped: boolean
  collector: MessageCollector
}

export const ListenBossCollectors = new Chest<string, ListenBossData>()

export const listenBoss = (client: Client, msg: Message) => {
  const author = msg.author
  if (ListenBossCollectors.has(author.id))
    return msg.reply('Да, хозяин, я здесь!')
  const coll = msg.channel.createMessageCollector({
    filter: (m) => m.author.id === msg.author.id && !!m.content,
    time: 30000,
  })
  msg.reply('Слушаю, хозяин')
  const data = <ListenBossData>{ stoped: false, collector: coll }
  ListenBossCollectors.set(msg.author.id, data)
  coll.on('collect', (_msg) => {
    const args = _msg.content?.split(/ +/g).map((msg) => msg.toLowerCase())
    coll.resetTimer()
    resolveDJMessage(client, _msg, args)
  })

  coll.on('end', () => {
    if (!data.stoped)
      msg.channel.send(
        `${msg.member}, хозяин, вы, кажется забыли обо мне, ладно..`,
      )

    ListenBossCollectors.delete(msg.author.id)
  })
}
