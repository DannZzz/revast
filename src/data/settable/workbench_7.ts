import { Size, Point } from 'src/global/global'
import { pointCircle } from 'intersects'
import { Converter } from '../../structures/Converter'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(7)
  .sources('WORKBENCH', 'ICON_WORKBENCH')
  .size(200, 200)
  .hp(300)
  .name('Workbench')
  .setMode(new Point(0, -100), { type: 'rect', ...new Size(145, 80) })
  .craftable({
    givesXp: 100,
    duration: 5,
    required: {
      3: 25,
      5: 10,
    },
  })
  .special({
    workbench: {
      within(point: Point) {
        return pointCircle(
          ...Converter.pointToXYArray(point),
          ...Converter.pointToXYArray(this.point),
          200,
        )
      },
    },
  })
  .build()
