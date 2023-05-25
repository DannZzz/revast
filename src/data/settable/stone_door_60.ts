import { Images } from 'src/structures/image-base'
import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(60)
  .itIsWall('stone')
  .name('Stone Door')
  .sources('STONE_DOOR', 'STONE_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      5: 30,
      40: 1,
    },
  })
  .mode({
    cover: false,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: Images.STONE_DOOR_OPEN,
  })
  .build()
