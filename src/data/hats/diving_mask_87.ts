import createItem from 'src/structures/item-creator/create-item'
import { HelmetsDefenseByResourceType } from '../config-type'

export default createItem(87, 'hat')
  .sources('DIVING_MASK', 'DIVING_MASK')
  .name('Diving Mask')
  .wearable()
  .wearableEffect({
    inWaterTempLoss: {
      day: -30,
      night: -30,
    },
    oxygenLoss: -20,
    inWaterSpeed: 40,
  })
  .craftable({
    duration: 10,
    givesXp: 500,
    state: { workbench: true },
    required: {
      49: 6,
      20: 40,
      42: 10,
    },
  })
  .defense(...HelmetsDefenseByResourceType.stone)
  .build()
