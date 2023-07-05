import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(104)
  .itIsSpike('gold', true)
  .name('Golden Spike Door')
  .sources('GOLDEN_SPIKE_DOOR', 'ICON_GOLDEN_SPIKE_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      5: 40,
      19: 80,
      62: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'GOLDEN_SPIKE_DOOR_OPEN',
  })
  .build()
