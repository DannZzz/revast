import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  PolygonPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 6,
  type: 'gold',
  source: Images.GOLD_2,
  givesXp: 3,
  resources: 40,
  validPosition: new CirclePosition(80),
  size: new Size(216, 275),
  rechargeAmount: 4,
})
