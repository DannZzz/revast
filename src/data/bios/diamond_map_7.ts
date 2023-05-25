import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  PolygonPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 7,
  type: 'diamond',
  source: Images.DIAMOND_1,
  givesXp: 4,
  resources: 20,
  validPosition: new CirclePosition(70),
  size: new Size(180, 225),
  rechargeAmount: 3,
})
