import { Point } from 'src/global/global'
import createItem from 'src/structures/item-creator/create-item'

export default createItem(1, 'weapon')
  .equipableDefault()
  .sources('GOLDEN_DOUBLE_SWORD', 'ICON_GOLDEN_DOUBLE_SWORD')
  .setVariant('sword')
  .name('Golden Double Sword')
  .data({
    luckType: 'amethyst',
    damage: 25,
    twoHandMode: {
      noActive: { handNode: { point: new Point(null, -10) } },
    },
  })
  .build()
