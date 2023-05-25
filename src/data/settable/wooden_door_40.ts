import { Images } from 'src/structures/image-base'
import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(40)
  .itIsWall('wood')
  .name('Wooden Door')
  .sources('WOODEN_DOOR', 'WOODEN_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      3: 30,
    },
  })
  .mode({
    cover: false,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: Images.WOODEN_DOOR_OPEN,
  })
  .build()
