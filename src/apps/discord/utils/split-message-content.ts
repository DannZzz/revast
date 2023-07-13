import { isNumber } from 'src/utils/is-number-in-range'
import { uniqueId } from 'src/utils/uniqueId'

export const splitDiscordMessageContent = (content: string): string[] => {
  let ap = <any>{}
  if (content.includes('%')) {
    let curr = content.indexOf('%') + 1
    for (let i = curr; i < content.length; i++) {
      const char = content[i]
      if (char === '%') {
        if (isNumber(curr)) {
          const id = uniqueId()
          content
          ap[id] = content.substring(curr, i)
          content =
            content.slice(0, curr - 1) + ` ${id} ` + content.slice(i + 1)
          curr = undefined
        } else {
          curr = i
        }
      }
    }
  }

  return content
    .trim()
    .split(/ +/g)
    .map((str) => (str in ap ? ap[str] : str))
}
