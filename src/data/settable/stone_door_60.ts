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
      5: 27,
      40: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'STONE_DOOR_OPEN',
  })
  .build()
