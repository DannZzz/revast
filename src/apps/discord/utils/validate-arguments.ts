import { levenshtein } from 'src/utils/levenshtein'
import { DJCommandLikeArguments } from '../commands/Command'

export const validateArguments = (
  args: DJCommandLikeArguments[],
  queue: string[],
): { success: boolean; args: string[] } => {
  let i = 0
  let _args = [...queue]
  return {
    success: args.every((argArray) => {
      return argArray.some((arg) => {
        if (!_args[i]) return false
        if (!_args[i].toLowerCase()) return false
        while (
          _args[i].toLowerCase().length < arg.ignoreWordIfLengthSmallerThan
        )
          i++
        let u = i + arg.ignoreNextCount
        if (
          levenshtein(arg.word, _args[u].toLowerCase(), arg.lshOptions) >
          arg.validAmount
        )
          return false
        i = u + 1
        return true
      })
    }),
    args: _args,
  }
}
