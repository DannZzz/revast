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
      20: 21,
      62: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'DIAMOND_DOOR_OPEN',
  })
  .build()
