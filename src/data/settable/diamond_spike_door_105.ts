import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(105)
  .itIsSpike('diamond', true)
  .name('Diamond Spike Door')
  .sources('DIAMOND_SPIKE_DOOR', 'DIAMOND_SPIKE_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      5: 40,
      20: 60,
      64: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'DIAMOND_SPIKE_DOOR_OPEN',
  })
  .build()
