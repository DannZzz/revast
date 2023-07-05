import { Point, Size } from 'src/global/global'
import createItem from 'src/structures/item-creator/create-item'
import { SpecialItemTypes } from '../config-type'

export default createItem(69, 'tool', SpecialItemTypes.repair)
  .equipableDefault()
  .sources('REPAIR', 'ICON_REPAIR')
  .name('Repair')
  .craftable({
    duration: 8,
    givesXp: 50,
    state: { workbench: true },
    required: {
      5: 70,
    },
  })
  .data({
    drawPosition: new Point(75, 75),
    range: 115,
    damage: 1,
    damageBuilding: -80,
    size: new Size(150, 150),
  })
  .build()
