import { levenshtein } from 'src/utils/levenshtein'
import { DJCommandLikeArguments } from '../commands/Command'

export const validateArguments = (
  args: DJCommandLikeArguments[],
  queue: string[],
): { success: boolean; args: string[]; acceptedArgs: string[] } => {
  let i = 0
  let _args = [...queue]
  const acceptedArgs: string[] = []
  return {
    success: args.every((argArray) => {
      const exists = argArray.args.some((arg) => {
        if (!_args[i]?.toLowerCase()) return false
        let u = i
        while (
          _args[u] &&
          _args[u].toLowerCase().length < arg.ignoreWordIfLengthSmallerThan
        )
          u++
        if (!_args[u]) return false
        u += arg.ignoreNextCount
        if (!_args[u]) return false
        if (
          typeof arg.word === 'function'
            ? !arg.word(_args[u]?.toLowerCase())
            : levenshtein(arg.word, _args[u]?.toLowerCase(), arg.lshOptions) >
              arg.validAmount
        )
          return false

        acceptedArgs.push(
          typeof arg.word === 'string' ? arg.word : _args[u]?.toLowerCase(),
        )
        i = u + 1
        return true
      })
      if (!exists && argArray.notRequired) {
        acceptedArgs.push(null)
        return true
      }
      return exists
    }),
    args: _args,
    acceptedArgs,
  }
}
