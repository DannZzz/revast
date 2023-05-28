import { glob } from 'glob'
import { join } from 'path'
import { ITEM_DIR_NAMES } from 'src/constant'
import { Items } from 'src/data/items'
import { Craft } from 'src/structures/Craft'

export async function loadItems() {
  const itemPaths = await glob(
    join(__dirname, `../data/{${ITEM_DIR_NAMES.join(',')}}/*.js`).replace(
      /\\/g,
      '/',
    ),
  )

  const items = await Promise.all(
    itemPaths.map(async (itemPath) => (await import(itemPath))?.default),
  )
  items.forEach((item) => Items.set(item.data.id, item))
  console.log(`${items.length} items were loaded!`)
  console.log(`${Craft.data.size} crafts were loaded!`)
}
