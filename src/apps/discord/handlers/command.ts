import { glob } from 'glob'
import { join } from 'path'
import { DJCommand } from '../commands/Command'
import DJCommandResolver from '../commands/Resolver'

export default async function loadDJCommands() {
  const commandsPaths = await glob(
    join(__dirname, `../commands/list/*.js`).replace(/\\/g, '/'),
  )

  const commands = await Promise.all(
    commandsPaths.map(async (itemPath) => (await import(itemPath))?.default),
  )

  commands.forEach((djc: DJCommand, i) => {
    DJCommandResolver.set(i, djc)
  })
  console.log('Discord bot commands were loaded: ' + commands.length)
}
