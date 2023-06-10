import { Images } from 'src/structures/image-base'
import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(62)
  .itIsWall('gold')
  .name('Golden Door')
  .sources('GOLDEN_DOOR', 'GOLDEN_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      19: 30,
      60: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'GOLDEN_DOOR_OPEN',
  })
  .build()
