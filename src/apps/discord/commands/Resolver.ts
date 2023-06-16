import { Chest, Cooldown } from 'anytool'
import { DJCommand, DJCommandExecuteData } from './Command'
import { Client, Message } from 'discord.js'
import { levenshtein } from 'src/utils/levenshtein'
import { ListenBossCollectors, listenBoss } from './collectors/listen-boss'
import { MyName } from '../utils/my-name'
import { openAiFind } from '../openai/OpenAi'
import { validateArguments } from '../utils/validate-arguments'
import { DJGameServerInteraction } from './collectors/game-server-interaction'
import { DJQuery } from './Query'

export const DJCommandResolver = new Chest<number, DJCommand>()
const MessageCooldown = new Cooldown(2500)

export const resolveDJMessage = (
  client: Client,
  msg: Message,
  args: string[],
) => {
  if (MessageCooldown.isLimited(msg.author.id)) return console.log('limit')
  if (!args[0]) {
    return listenBoss(client, msg, null, args)
  }
  const name = MyName.find(args)
  // console.log(name, args)
  let forCommands = [...args]
  if (name) {
    args.splice(args.indexOf(name), 1)
    forCommands = forCommands.slice(forCommands.indexOf(name) + 1)
    if (!args[0]) {
      return listenBoss(client, msg, name, args)
    }
  }

  if (
    args[0] &&
    !args[1] &&
    ['отвали', 'выключить', 'уйди', 'отстань', 'ладно'].some(
      (txt) => levenshtein(txt, args[0].toLowerCase()) < 3,
    )
  ) {
    const data = ListenBossCollectors.get(msg.author.id)
    data.stoped = true
    data.collector.stop()
    return
  }

  if (DJGameServerInteraction.isExpecting(msg.author.id)) {
    const expected = DJGameServerInteraction.tryFor(msg.author.id, msg, args)
    if (expected) return
  }

  const commands = DJCommandResolver.values()
  for (let cmd of commands) {
    const validated = validateArguments(cmd.arguments, forCommands)
    if (!validated.success) continue
    if (cmd.admin && !MyName.admins.includes(msg.author.id))
      return msg.reply('Если Дэн скажет - сделаю!')
    cmd.execute.call(cmd, <DJCommandExecuteData>{
      client,
      args: validated.args,
      author: msg.author as any,
      msg,
      acceptedArgs: validated.acceptedArgs,
      query: validated.query,
    })
    return
  }
  msg.channel.sendTyping()
  openAiFind(args.join(' ')).then((response) => {
    msg.reply({
      content: response,
    })
  })
}

export default DJCommandResolver
