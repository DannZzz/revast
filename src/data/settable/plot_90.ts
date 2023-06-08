import { Point, Size } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'
import { SpecialItemTypes } from '../config-type'

export default createSettable(90, SpecialItemTypes.plot)
  .sources('PLOT', 'ICON_PLOT')
  .cover(-3)
  .name('Plot')
  .size(100, 100)
  .hp(1500)
  .setMode(new Point(0, 120), { type: 'rect', ...new Size(99, 99) }, true)
  .craftable({
    givesXp: 30,
    duration: 4,
    state: { workbench: true },
    required: {
      3: 20,
      81: 15,
    },
  })
  .build()
