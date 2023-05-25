import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  PolygonPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 11,
  type: 'emerald',
  source: Images.EMERALD_1,
  givesXp: 7,
  resources: 20,
  validPosition: new CirclePosition(80),
  size: new Size(207, 259),
  rechargeAmount: 3,
})
