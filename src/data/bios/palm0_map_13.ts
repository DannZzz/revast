import { Point, Size } from 'src/global/global'
import { BasicBioItem, CirclePosition } from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 13,
  type: 'wood',
  source: Images.PALM_0,
  resources: 15,
  givesXp: 1,
  validPosition: new CirclePosition(40),
  size: new Size(300, 300),
  rechargeAmount: 3,
})
