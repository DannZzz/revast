import { Images } from 'src/structures/image-base'
import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(68)
  .itIsWall('ruby')
  .name('Ruby Door')
  .sources('RUBY_DOOR', 'RUBY_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      22: 15,
      66: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'RUBY_DOOR_OPEN',
  })
  .build()
