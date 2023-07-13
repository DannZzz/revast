import { Point, Size } from 'src/global/global'
import createItem from 'src/structures/item-creator/create-item'

export default createItem(121, 'weapon')
  .equipableDefault()
  .setVariant('sword')
  .name('Dragon Sword')
  .setItemResourceType('dragon')
  .iconSource('ICON_DRAGON_SWORD')
  .source('DRAGON_SWORD')
  .data({
    damage: 33,
    drawPosition: new Point(63, 98),
    size: new Size(115, 115),
  })
  .craftable({
    state: { workbench: true, fire: true },
    required: {
      51: 2,
      119: 1,
      29: 1,
    },
  })
  .build()
