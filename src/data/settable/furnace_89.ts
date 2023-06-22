import { pointCircle } from 'intersects'
import { ExtendedSettable } from 'src/game/extended/settable/actionable.basic'
import { Point, Size } from 'src/global/global'
import { Converter } from 'src/structures/Converter'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(89, 'furnace')
  .sources('FURNACE', 'FURNACE_ENABLED')
  .name('Furnace')
  .craftable({
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
    drawOffset: new Point(0, 5),
    noBackground: true,
  })
  .highlight({ type: 'circle', data: { radius: 230 } })
  .actionable({
    reactRadius: 100,
    draw: {
      backgroundSource: 'FURNACE',
      size: new Size(120, 120),
    },
  })
  .onInit((settable) => {
    settable.holders[0].data.onChange((data) => {
      settable.currentModeIndex(data.quantity > 0 ? 1 : 0)
      if (data.quantity > 0 && !settable.timeouts.usingWood) {
        settable.timeouts.usingWood = setInterval(() => {
          settable.holders[0].add(3, -1)
          settable.update()
        }, 5000)
      } else if (data.quantity <= 0 && settable.timeouts.usingWood) {
        clearInterval(settable.timeouts.usingWood)
        settable.timeouts.usingWood = null
      }
    })
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
  .onDestroy((settable) => {
    clearInterval(settable.timeouts.usingWood)
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
