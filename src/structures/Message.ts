import { uuid } from 'anytool'
import { Transform } from 'class-transformer'
import AdminCommands from 'src/admin/admin-commands'
import {
  ADMIN_COMMAND_PREFIX,
  ADMIN_PASSWORDS,
  MESSAGE_MAX_LENGTH,
} from 'src/constant'
import { Player } from 'src/game/player/player'

export class Message {
  content: string
  readonly id = `msg-${uuid(50)}`

  @Transform(({ value }) => value?.id?.())
  author: Player
  constructor(content: string, author: Player) {
    this.content = content
    this.author = author
    this.normalizeLength()
    this.checkAdminPassword()
    if (!this.public()) AdminCommands.tryAny(this.content, author)
  }

  isCommandLike() {
    return (
      this.content.startsWith(ADMIN_COMMAND_PREFIX) &&
      !this.content.startsWith(ADMIN_COMMAND_PREFIX + ' ')
    )
  }

  filter() {
    return this
  }

  private checkAdminPassword() {
    // giving admin
    if (this.isCommandLike()) {
      if (this.content.startsWith(`${ADMIN_COMMAND_PREFIX}pass `)) {
        const pass = this.content
          .slice(`${ADMIN_COMMAND_PREFIX}pass `.length)
          .trim()
        if (ADMIN_PASSWORDS.includes(pass)) {
          this.author.settings.admin(true)
          this.author.socket().emit('serverMessage', ['Activated!'])
        }
      }
    }
    return this
  }

  public() {
    return !(this.author.settings.admin() && this.isCommandLike())
  }

  normalizeLength() {
    this.content = this.content.slice(0, MESSAGE_MAX_LENGTH).trim()
    return this
  }
}
