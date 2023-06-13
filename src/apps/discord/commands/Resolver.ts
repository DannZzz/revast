import { Chest } from 'anytool'
import { DJCommand } from './Command'
import { Client, Message } from 'discord.js'
import { levenshtein } from 'src/utils/levenshtein'
import { ListenBossCollectors, listenBoss } from './collectors/listen-boss'
import { MyName } from '../utils/my-name'
import { openAiFind } from '../openai/OpenAi'

export const DJCommandResolver = new Chest<number, DJCommand>()

export const resolveDJMessage = (
  client: Client,
  msg: Message,
  args: string[],
) => {
  const name = MyName.find(args)
  if (name) {
    args = args.slice(args.indexOf(name) + 1)
    if (!args[0]) {
      return listenBoss(client, msg)
    }
  }

  if (
    !args[1] &&
    ['отвали', 'выключить', 'уйди'].some((txt) => levenshtein(txt, args[0]) < 3)
  ) {
    msg.reply('Хорошо, хозяин')
    const data = ListenBossCollectors.get(msg.author.id)
    data.stoped = true
    data.collector.stop()
    return
  }

  const commands = DJCommandResolver.values()
  for (let cmd of commands) {
    let i = 0
    let _args = [...args]
    if (cmd.admin && !MyName.admins.includes(msg.author.id)) continue
    if (
      !cmd.arguments.every((arg) => {
        if (!_args[i]) return false
        while (_args[i].length < arg.ignoreWordIfLengthSmallerThan) i++
        i += arg.ignoreNextCount
        if (levenshtein(arg.word, _args[i], arg.lshOptions) > arg.validAmount)
          return false

        i++
        return true
      })
    )
      continue

    cmd.execute.call(cmd, { client, args: _args, author: msg.author, msg })
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
