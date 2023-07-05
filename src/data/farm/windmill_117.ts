import { createGameTick } from 'src/constant'
import { ActionableSettableItem } from 'src/game/extended/settable/actionable.settable'
import { Point, Size } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(117, 'windmill')
  .sources('WINDMILL', 'ICON_WINDMILL')
  .name('Windmill')
  .craftable({
    givesXp: 300,
    duration: 14,
    state: { workbench: true },
    required: {
      42: 2,
      5: 60,
      3: 50,
    },
  })
  .mode({
    cover: 1,
    trigger: 'custom',
    verify: () => true,
    source: 'WINDMILL',
  })
  .size(319, 325)
  .hp(1000)
  .setMode(new Point(0, -162.5), { type: 'circle', radius: 50 })
  .holders(
    {
      takeable: false,
      allow: [113],
      drawOffset: new Point(40, 15),
      noBackground: true,
      max: 255,
    },
    {
      takeable: true,
      allow: [0],
      drawOffset: new Point(-45, 15),
      noBackground: true,
      max: 255,
    },
  )
  .onInit((settable) => {
    settable.timeouts.tick = createGameTick()

    const isWorking = () =>
      settable.holders[1].quantity() < settable.holders[1].max &&
      settable.holders[0].quantity() > 0

    settable.holders[0].data.onChange((_, old) => {
      old.quantity === 0 && settable.timeouts.tick.take()
      settable.currentModeIndex(isWorking() ? 1 : 0)
    })
    settable.holders[1].data.onChange((_, old) => {
      old.quantity === settable.holders[1].max && settable.timeouts.tick.take()
      settable.currentModeIndex(isWorking() ? 1 : 0)
    })
  })
  .loop((settable: ActionableSettableItem) => {
    if (settable.timeouts.tick.limited()) return
    if (
      settable.holders[0].quantity() > 0 &&
      settable.holders[1].quantity() < settable.holders[1].max
    ) {
      settable.holders[0].add(113, -1)
      settable.holders[1].add(115, 1)
      settable.timeouts.tick.take()
      settable.update()
    }
  })
  .actionable({
    reactRadius: 75,
    draw: {
      backgroundSource: 'WINDMILL_INTERFACE',
      size: new Size(205, 128),
      offset: new Point(25, 0),
    },
  })
  .buildActionable()
