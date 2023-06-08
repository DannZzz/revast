import { Point, Size } from 'src/global/global'
import {
  BasicBioItem,
  CirclePosition,
  RectPosition,
} from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 1,
  type: 'berry',
  source: Images.BERRY_BUSH,
  givesXp: 2,
  resources: 6,
  size: new Size(170, 170),
  rechargeAmount: 1,
  validPosition: new CirclePosition(60),
  getWithEverything: true,
  onResourcesChangeDrawEvent: true,
})
