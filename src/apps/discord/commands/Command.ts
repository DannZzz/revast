import { Client, GuildMember, Message } from 'discord.js'
import { LevenshteinOptions } from 'src/utils/levenshtein'
import { DJQuery } from './Query'

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
  query?: string
}

export interface DJCommandExecuteData {
  client: Client
  args: string[]
  author: GuildMember
  msg: Message
  acceptedArgs: string[]
  query: DJQuery
}

export class DJCommand {
  arguments: DJCommandLikeArguments[]
  admin?: boolean = false
  examples?: string[] = []

  execute: (this: DJCommand, data: DJCommandExecuteData) => void

  constructor(data: DJCommand) {
    Object.assign(this, data)
  }
}
