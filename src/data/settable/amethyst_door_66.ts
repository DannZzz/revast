import { Images } from 'src/structures/image-base'
import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(66)
  .itIsWall('amethyst')
  .name('Amethyst Door')
  .sources('AMETHYST_DOOR', 'AMETHYST_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      21: 30,
      64: 1,
    },
  })
  .mode({
    cover: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: Images.AMETHYST_DOOR_OPEN,
  })
  .build()
