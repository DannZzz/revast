import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(102)
  .itIsSpike('wood', true)
  .name('Wooden Spike Door')
  .sources('WOODEN_SPIKE_DOOR', 'ICON_WOODEN_SPIKE_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      3: 50,
      5: 40,
      40: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'WOODEN_SPIKE_DOOR_OPEN',
  })
  .build()
