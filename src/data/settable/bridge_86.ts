import { Point, Size } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'
import { SpecialItemTypes } from '../config-type'

export default createSettable(86, SpecialItemTypes.bridge)
  .sources('BRIDGE', 'ICON_BRIDGE')
  .cover(-4)
  .name('Bridge')
  .size(100, 100)
  .hp(1000)
  .setMode(new Point(0, 120), { type: 'rect', ...new Size(99, 99) }, true)
  .craftable({
    givesXp: 30,
    duration: 5,
    state: { workbench: true },
    required: {
      3: 30,
    },
  })
  .data({
    ignoreCheckers: 'type',
    onThe: { water: true },
    showHpRadius: 30,
  })
  .build()
