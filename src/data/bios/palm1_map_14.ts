import { Point, Size } from 'src/global/global'
import { BasicBioItem, CirclePosition } from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 14,
  type: 'wood',
  source: Images.PALM_1,
  resources: 25,
  givesXp: 1,
  validPosition: new CirclePosition(50),
  size: new Size(375, 375),
  rechargeAmount: 4,
})
