import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(103)
  .itIsSpike('stone', true)
  .name('Stone Spike Door')
  .sources('STONE_SPIKE_DOOR', 'ICON_STONE_SPIKE_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      5: 120,
      60: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'STONE_SPIKE_DOOR_OPEN',
  })
  .build()
