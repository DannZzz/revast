import { Point, Size } from 'src/global/global'
import createItem from 'src/structures/item-creator/create-item'

export default createItem(120, 'weapon')
  .equipableDefault()
  .setVariant('spear')
  .name('Dragon Spear')
  // .setEquipmentItemSize('spears')
  .setItemResourceType('dragon')
  .iconSource('ICON_DRAGON_SPEAR')
  .source('DRAGON_SPEAR')
  .data({
    damage: 26,
    drawPosition: new Point(48, 185),
    size: new Size(75, 210),
  })
  .craftable({
    state: { workbench: true, fire: true },
    required: {
      51: 2,
      119: 1,
      38: 1,
    },
  })
  .build()
