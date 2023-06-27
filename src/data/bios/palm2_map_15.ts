import { Point, Size } from 'src/global/global'
import { BasicBioItem, CirclePosition } from '../../game/basic/bio-item.basic'
import { Images } from '../../structures/image-base'

export default new BasicBioItem({
  mapId: 15,
  type: 'wood',
  source: Images.PALM_2,
  resources: 35,
  givesXp: 1,
  validPosition: new CirclePosition(70),
  size: new Size(450, 450),
  rechargeAmount: 5,
})
