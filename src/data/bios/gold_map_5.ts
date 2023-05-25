import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  PolygonPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 5,
  type: 'gold',
  source: Images.GOLD_1,
  givesXp: 3,
  resources: 25,
  validPosition: new CirclePosition(70),
  size: new Size(180, 225),
  rechargeAmount: 3,
})
