import { Images } from 'src/structures/image-base'
import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(64)
  .itIsWall('diamond')
  .name('Diamond Door')
  .sources('DIAMOND_DOOR', 'DIAMOND_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      20: 30,
      62: 1,
    },
  })
  .mode({
    cover: false,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: Images.DIAMOND_DOOR_OPEN,
  })
  .build()
