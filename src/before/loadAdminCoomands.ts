import { glob } from 'glob'
import { join } from 'path'
import AdminCommands from 'src/admin/admin-commands'

export async function loadAdminCommands() {
  const itemPaths = await glob(
    join(__dirname, `../admin/commands/*.js`).replace(/\\/g, '/'),
  )

  const commands = await Promise.all(
    itemPaths.map(async (itemPath) => (await import(itemPath))?.default),
  )
  commands.forEach((item) => AdminCommands.registerCommand(item))
  console.log(`${commands.length} admin commands were loaded!`)
}
