import { Point, Size } from 'src/global/global'
import { pointCircle } from 'intersects'
import { Converter } from '../../structures/Converter'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(8, 'campfire')
  .sources('CAMPFIRE', 'ICON_CAMPFIRE')
  .disableCover()
  .name('Campfire')
  .size(202, 189)
  .hp(250)
  .setMode(new Point(0, -120), { type: 'rect', ...new Size(100, 100) })
  .craftable({
    givesXp: 30,
    duration: 8,
    required: {
      3: 30,
      5: 10,
    },
  })
  .duration(180)
  .highlight({ type: 'circle', data: { radius: 230 } })
  .special({
    firePlace: {
      within(point) {
        return pointCircle(
          ...Converter.pointToXYArray(point),
          ...Converter.pointToXYArray(this.point),
          200,
        )
      },
      addsTemperature: 30,
    },
  })
  .build()
