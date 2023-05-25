import { ADMIN_COMMAND_PREFIX } from 'src/constant'
import { Command, CommandArgument } from './Command'
import { Player } from 'src/game/player/player'

class Admin {
  readonly commands: Array<Command> = []

  registerCommand(command: any) {
    if (command instanceof Command) this.commands.push(command)
  }

  tryAny(contentCommandLike: string, player: Player) {
    const args = contentCommandLike
      .slice(ADMIN_COMMAND_PREFIX.length)
      .split(/ +/g)
    const cmdName = args.shift()
    for (let command of this.commands) {
      if (command.try(player, cmdName, args)) break
    }
  }
}

const AdminCommands = new Admin()

export default AdminCommands
