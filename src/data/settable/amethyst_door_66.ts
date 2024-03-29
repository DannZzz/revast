import { Images } from 'src/structures/image-base'
import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(66)
  .itIsWall('amethyst')
  .name('Amethyst Door')
  .sources('AMETHYST_DOOR', 'ICON_AMETHYST_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      21: 18,
      64: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'AMETHYST_DOOR_OPEN',
  })
  .build()
