import { Point, Size } from 'src/global/global'
import createItem from 'src/structures/item-creator/create-item'

export default createItem(43, 'tool', 'book')
  .equipableDefault()
  .name('Book')
  .craftable({
    duration: 10,
    givesXp: 300,
    required: {
      32: 4,
      42: 4,
      41: 4,
    },
    state: { workbench: true },
  })
  .data({
    drawPosition: new Point(50, 60),
    range: 50,
    damage: 1,
    size: new Size(120, 120),
  })
  .sources('BOOK', 'ICON_BOOK')
  .build()
