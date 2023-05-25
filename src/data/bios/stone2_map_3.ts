import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  PolygonPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 3,
  type: 'stone',
  source: Images.STONE_1,
  givesXp: 2,
  resources: 40,
  validPosition: new CirclePosition(80),
  size: new Size(216, 275),
  rechargeAmount: 4,
})
