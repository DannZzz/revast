import { glob } from 'glob'
import { join } from 'path'
import { MOB_DIR_NAMES } from 'src/constant'
import { Mobs } from 'src/data/mobs'

export async function loadMobs() {
  const mobPaths = await glob(
    join(__dirname, `../data/${MOB_DIR_NAMES[0]}/*.js`).replace(/\\/g, '/'),
  )

  const mobs = await Promise.all(
    mobPaths.map(async (itemPath) => (await import(itemPath))?.default),
  )
  mobs.forEach((item) => Mobs.data.set(item.name, item))

  console.log(`${mobs.length} mobs were loaded!`)
}
//
