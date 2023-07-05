import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(107)
  .itIsSpike('ruby', true)
  .name('Ruby Spike Door')
  .sources('RUBY_SPIKE_DOOR', 'ICON_RUBY_SPIKE_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      5: 40,
      22: 100,
      68: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'RUBY_SPIKE_DOOR_OPEN',
  })
  .build()
