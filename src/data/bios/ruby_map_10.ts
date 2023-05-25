import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  PolygonPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 10,
  type: 'ruby',
  source: Images.RUBY_1,
  givesXp: 6,
  resources: 30,
  validPosition: new CirclePosition(70),
  size: new Size(180, 225),
  rechargeAmount: 3,
})
