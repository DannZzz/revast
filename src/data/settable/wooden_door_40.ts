import { Images } from 'src/structures/image-base'
import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(40)
  .itIsWall('wood')
  .name('Wooden Door')
  .sources('WOODEN_DOOR', 'ICON_WOODEN_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      3: 30,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'WOODEN_DOOR_OPEN',
  })
  .build()
