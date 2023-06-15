import { Client, GuildMember, Message } from 'discord.js'
import { LevenshteinOptions } from 'src/utils/levenshtein'

interface DJCommandArgument {
  ignoreWordIfLengthSmallerThan: number
  lshOptions: LevenshteinOptions
  word: string | ((arg: string) => boolean)
  ignoreNextCount: number
  validAmount: number
}

export type DJCommandLikeArguments = {
  args: DJCommandArgument[]
  notRequired?: boolean
}

export class DJCommand {
  arguments: DJCommandLikeArguments[]
  admin?: boolean = false
  examples?: string[] = []

  execute: (
    this: DJCommand,
    data: { client: Client; args: string[]; author: GuildMember; msg: Message },
  ) => void

  constructor(data: DJCommand) {
    Object.assign(this, data)
  }
}
