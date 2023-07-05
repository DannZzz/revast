import createSettable from 'src/structures/item-creator/create-settable'
import { verifyItemOfTeam } from '../config-type'

export default createSettable(106)
  .itIsSpike('amethyst', true)
  .name('Amethyst Spike Door')
  .sources('AMETHYST_SPIKE_DOOR', 'ICON_AMETHYST_SPIKE_DOOR')
  .craftable({
    state: { workbench: true },
    required: {
      5: 40,
      21: 90,
      66: 1,
    },
  })
  .mainMode({ switchTo: 1, trigger: 'attack', verify: verifyItemOfTeam })
  .mode({
    cover: 0,
    switchTo: 0,
    trigger: 'attack',
    verify: verifyItemOfTeam,
    source: 'AMETHYST_SPIKE_DOOR_OPEN',
  })
  .build()
