import { createGameTick } from 'src/constant'
import { ActionableSettableItem } from 'src/game/extended/settable/actionable.settable'
import { Point, Size } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(118, 'bread-oven')
  .sources('BREAD_OVEN_OFF', 'ICON_BREAD_OVEN')
  .name('Bread Oven')
  .craftable({
    givesXp: 300,
    duration: 12,
    state: { workbench: true },
    required: {
      5: 50,
      3: 50,
    },
  })
  .size(184, 162)
  .hp(1000)
  .setMode(new Point(0, -162), { type: 'circle', radius: 55 })
  .holders(
    {
      takeable: false,
      allow: [3],
      drawOffset: new Point(0, 90),
      noBackground: true,
      max: 31,
    },
    {
      takeable: false,
      allow: [115],
      drawOffset: new Point(0, 15),
      noBackground: true,
      max: 31,
    },
    {
      takeable: true,
      allow: [0],
      drawOffset: new Point(0, -62),
      noBackground: true,
      max: 31,
    },
  )
  .mode({
    cover: 1,
    trigger: 'custom',
    verify: () => true,
    source: 'BREAD_OVEN',
  })
  .onInit((settable) => {
    settable.timeouts.tick = createGameTick()

    const isWorking = (): boolean => {
      return (
        settable.holders[0].quantity() > 0 &&
        settable.holders[1].quantity() > 0 &&
        settable.holders[2].quantity() < settable.holders[2].max
      )
    }

    settable.holders[0].data.onChange((_, old) => {
      old.quantity === 0 && settable.timeouts.tick.take()
      settable.currentModeIndex(isWorking() ? 1 : 0)
    })
    settable.holders[1].data.onChange((_, old) => {
      old.quantity === 0 && settable.timeouts.tick.take()
      settable.currentModeIndex(isWorking() ? 1 : 0)
    })
    settable.holders[2].data.onChange((_, old) => {
      old.quantity === settable.holders[2].max && settable.timeouts.tick.take()
      settable.currentModeIndex(isWorking() ? 1 : 0)
    })
  })
  .loop((settable: ActionableSettableItem) => {
    if (settable.timeouts.tick.limited()) return
    if (
      settable.holders[0].quantity() > 0 &&
      settable.holders[1].quantity() > 0 &&
      settable.holders[2].quantity() < settable.holders[2].max
    ) {
      settable.holders[0].add(3, -1)
      settable.holders[1].add(115, -1)
      settable.holders[2].add(116, 1)
      settable.timeouts.tick.take()
      settable.players.get(settable.authorId)?.lbMember.add(20)
      settable.update()
    }
  })
  .actionable({
    reactRadius: 75,
    draw: {
      backgroundSource: 'BREAD_OVEN_INTERFACE',
      size: new Size(96, 262),
    },
  })
  .buildActionable()
