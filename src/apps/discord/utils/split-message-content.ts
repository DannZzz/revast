import { uuid } from 'anytool'
import { isNumber } from 'src/utils/is-number-in-range'

export const splitDiscordMessageContent = (content: string): string[] => {
  let ap = <any>{}
  if (content.includes('%')) {
    let curr = content.indexOf('%') + 1
    for (let i = curr; i < content.length; i++) {
      const char = content[i]
      if (char === '%') {
        if (isNumber(curr)) {
          const id = uuid(6)
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
