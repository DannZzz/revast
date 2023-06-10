import { Point, Size } from 'src/global/global'
import createItem from 'src/structures/item-creator/create-item'
import { SpecialItemTypes } from '../config-type'

export default createItem(93, 'tool', SpecialItemTypes.watering_can)
  .equipableDefault()
  .sources('WATERING_CAN_FULL', 'ICON_WATERING_CAN_FULL')
  .name('Watering Can Full')
  .craftable({
    duration: 2,
    givesXp: 0,
    state: { water: true },
    required: {
      92: 1,
    },
  })
  .data({
    drawPosition: new Point(60, 115),
    range: 115,
    damage: 0,
    size: new Size(120, 120),
  })
  .build()
