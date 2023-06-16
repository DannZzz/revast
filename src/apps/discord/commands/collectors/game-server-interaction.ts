import { Chest } from 'anytool'
import GameServers from 'src/servers/game-servers'
import { DJCommandLikeArguments } from '../Command'
import { validateArguments } from '../../utils/validate-arguments'
import exp from 'constants'
import { Message } from 'discord.js'

interface DJInteractionData {
  expects?: { args: DJCommandLikeArguments[]; after: DJInteractionDataCallback }
  currentServer?: string
}

type DJInteractionDataCallback = (
  this: DJInteractionData,
  msg: Message,
  data: { args: string[]; acceptedArgs: string[] },
) => void

export class DJGameServerInteraction {
  static readonly collectors = new Chest<string, DJInteractionData>()

  static isExpecting(id: string) {
    return !!this.collectors.get(id)?.expects
  }

  static expect(
    id: string,
    args: DJCommandLikeArguments[],
    after: DJInteractionDataCallback,
  ) {
    const expects = { args, after }
    if (this.collectors.has(id)) {
      this.collectors.get(id).expects = expects
    } else {
      this.collectors.set(id, { expects })
    }
    return this
  }

  static tryFor(id: string, msg: Message, args: string[]) {
    const data = this.collectors.get(id)
    const expects = data.expects
    const validate = validateArguments(expects.args, args)
    if (validate.success) {
      expects.after.call(data, msg, {
        args: validate.args,
        acceptedArgs: validate.acceptedArgs,
      })
      console.log(expects, this.collectors.get(id).expects)
      return true
    }
    return false
  }

  static servers() {
    return [...GameServers.values()]
  }
}
