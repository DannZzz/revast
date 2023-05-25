import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  PolygonPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 8,
  type: 'diamond',
  source: Images.DIAMOND_2,
  givesXp: 4,
  resources: 40,
  validPosition: new CirclePosition(85),
  size: new Size(216, 275),
  rechargeAmount: 4,
})
