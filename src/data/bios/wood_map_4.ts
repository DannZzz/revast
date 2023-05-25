import { Point, Size } from 'src/global/global'
import { BasicBioItem, CirclePosition } from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 4,
  type: 'wood',
  source: Images.TREE_1,
  resources: 35,
  givesXp: 1,
  validPosition: new CirclePosition(130),
  size: new Size(300, 300),
  rechargeAmount: 5,
})
