import { Player } from 'src/game/player/player'

interface AnyArg {
  required?: true
  desc: string
  validate: (arg: string) => boolean
  errorMsg?: (arg: string) => string
}

export const CommandArgument = {
  number: (arg: string) => !isNaN(+arg),
  idOrAll: (arg: string) => !isNaN(+arg) || arg === 'all',
}

export class Command<T extends string = any> {
  readonly aliases: string[] = []
  private onMatch: (author: Player, args: string[]) => void
  readonly args: AnyArg[] = []

  constructor(
    readonly name: T,
    options: {
      aliases?: string[]
      args?: AnyArg[]
      onMatch: (author: Player, args: string[]) => void
    },
  ) {
    const { aliases = [], args = [], onMatch } = options
    this.aliases.push(...aliases)
    this.args.push(...args)
    this.onMatch = onMatch
  }

  try(player: Player, cmdName: string, args: string[]): boolean {
    if (![this.name, ...this.aliases].includes(cmdName)) return false
    // checking args
    const makeMsg = (c: string) => player.socket?.().emit('serverMessage', [c])
    if (this.args.length !== 0) {
      if (args.length < this.args.filter((arg) => arg.required).length) {
        makeMsg('Missing arguments!')
        return false
      }
      for (let i = 0; i < this.args.length; i++) {
        const arg = this.args[i]
        const sArg = args[i]
        const msg = (c: string) =>
          makeMsg(arg.errorMsg ? arg.errorMsg(sArg) : c)
        if (!sArg && !arg.required) continue
        if (arg.required && !sArg) {
          msg('Missing arguments!')
          return false
        }
        if (!arg.validate(sArg)) {
          msg(`Invalid argument (${i + 1})`)
          return false
        }
      }
    }

    this.onMatch(player, args)
    return true
  }
}
