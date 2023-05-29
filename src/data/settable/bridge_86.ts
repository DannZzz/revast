import { Point, Size } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(86, 'bridge')
  .sources('BRIDGE', 'BRIDGE')
  .disableCover()
  .name('Bridge')
  .size(140, 140)
  .hp(250)
  .setMode(new Point(0, 120), { type: 'rect', ...new Size(140, 140) }, true)
  .craftable({
    givesXp: 30,
    duration: 8,
    state: { workbench: true },
    required: {
      3: 30,
    },
  })
  .build()
