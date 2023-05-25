import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  PolygonPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 9,
  type: 'amethyst',
  source: Images.AMETHYST_1,
  givesXp: 5,
  resources: 30,
  validPosition: new CirclePosition(80),
  size: new Size(216, 270),
  rechargeAmount: 3,
})
