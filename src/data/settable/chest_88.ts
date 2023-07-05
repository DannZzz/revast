import { ExtendedSettable } from 'src/game/extended/settable/actionable.basic'
import { Point, Size } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(88, 'chest')
  .sources('CHEST', 'ICON_CHEST')
  .name('Chest')
  .craftable({
    givesXp: 50,
    duration: 5,
    state: { workbench: true },
    required: {
      3: 30,
      19: 5,
    },
  })
  .hp(1000)
  .holders({
    takeable: true,
    allow: [],
    drawOffset: new Point(0, 10),
    noBackground: true,
  })
  .actionable({
    reactRadius: 75,
    draw: {
      backgroundSource: 'CHEST_INTERFACE',
      size: new Size(89, 112),
    },
  })
  .onInit((settable) => {})
  .size(125, 125)
  .data<ExtendedSettable>({
    setMode: {
      itemSize: { type: 'rect', width: 100, height: 60 },
      offset: new Point(0, -125),
    },
  })
  .buildActionable()
