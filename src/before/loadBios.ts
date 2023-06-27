import { glob } from 'glob'
import { join } from 'path'
import { BIOS_DIR_NAMES, ITEM_DIR_NAMES } from 'src/constant'
import { BioItems } from 'src/data/bio'

export async function loadBios() {
  const itemPaths = await glob(
    join(__dirname, `../data/{${BIOS_DIR_NAMES.join(',')}}/*.js`).replace(
      /\\/g,
      '/',
    ),
  )

  const items = await Promise.all(
    itemPaths.map(async (itemPath) => (await import(itemPath))?.default),
  )
  items.forEach((item) => BioItems.set(item.data.mapId, item))
  console.log(`${items.length} bios were loaded!`)
}
