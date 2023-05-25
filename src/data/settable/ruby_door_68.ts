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
      22: 30,
      66: 1,
    },
  })
  .mode({
    cover: false,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: Images.RUBY_DOOR_OPEN,
  })
  .build()
