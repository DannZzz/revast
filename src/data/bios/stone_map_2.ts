import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  PolygonPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 2,
  type: 'stone',
  source: Images.STONE_2,
  givesXp: 2,
  resources: 25,
  validPosition: new CirclePosition(65),
  size: new Size(176, 174),
  rechargeAmount: 3,
})
