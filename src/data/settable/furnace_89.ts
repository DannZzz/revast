import { pointCircle } from 'intersects'
import { createGameTick } from 'src/constant'
import { ExtendedSettable } from 'src/game/extended/settable/actionable.basic'
import { ActionableSettableItem } from 'src/game/extended/settable/actionable.settable'
import { Point, Size } from 'src/global/global'
import { Converter } from 'src/structures/Converter'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(89, 'furnace')
  .sources('FURNACE', 'ICON_FURNACE')
  .name('Furnace')
  .craftable({
    givesXp: 300,
    duration: 10,
    state: { workbench: true },
    required: {
      19: 15,
      5: 50,
      3: 150,
    },
  })
  .hp(1000)
  .holders({
    takeable: false,
    allow: [3],
    drawOffset: new Point(0, 13),
    noBackground: true,
  })
  .actionable({
    reactRadius: 100,
    draw: {
      backgroundSource: 'FURNACE_INTERFACE',
      size: new Size(89, 124),
    },
  })
  .onInit((settable) => {
    settable.timeouts.tick = createGameTick()
    settable.holders[0].data.onChange((current, old) => {
      settable.currentModeIndex(current.quantity > 0 ? 1 : 0)
      if (old.quantity === 0) settable.timeouts.tick.take()
    })
  })
  .loop((settable: ActionableSettableItem) => {
    if (settable.timeouts.tick.limited()) return
    if (settable.holders[0].quantity() > 0) {
      settable.holders[0].add(3, -1)
      settable.timeouts.tick.take()
      settable.update()
    }
  })
  .special({
    firePlace: {
      within(point) {
        if (this.currentModeIndex() === 0) return false
        return pointCircle(
          ...Converter.pointToXYArray(point),
          ...Converter.pointToXYArray(this.point),
          200,
        )
      },
      addsTemperature: 30,
    },
  })
  .mode({
    cover: 1,
    trigger: 'custom',
    verify: () => true,
    source: 'FURNACE_ENABLED',
  })
  .size(200, 200)
  .data<ExtendedSettable>({
    setMode: {
      itemSize: { type: 'circle', radius: 76 },
      offset: new Point(0, -170),
    },
  })
  .buildActionable()
