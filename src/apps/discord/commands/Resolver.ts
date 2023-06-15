import { Chest } from 'anytool'
import { DJCommand } from './Command'
import { Client, Message } from 'discord.js'
import { levenshtein } from 'src/utils/levenshtein'
import { ListenBossCollectors, listenBoss } from './collectors/listen-boss'
import { MyName } from '../utils/my-name'
import { openAiFind } from '../openai/OpenAi'
import { validateArguments } from '../utils/validate-arguments'

export const DJCommandResolver = new Chest<number, DJCommand>()

export const resolveDJMessage = (
  client: Client,
  msg: Message,
  args: string[],
) => {
  if (!args[0]) {
    return listenBoss(client, msg, null, args)
  }
  const name = MyName.find(args)
  // console.log(name, args)
  let forCommands = [...args]
  if (name) {
    args.splice(args.indexOf(name), 1)
    forCommands = forCommands.slice(args.indexOf(name))
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

  const commands = DJCommandResolver.values()
  for (let cmd of commands) {
    if (cmd.admin && !MyName.admins.includes(msg.author.id)) continue
    const validated = validateArguments(cmd.arguments, args)
    if (!validated.success) continue
    cmd.execute.call(cmd, {
      client,
      args: validated.args,
      author: msg.author,
      msg,
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
