import createItem from 'src/structures/item-creator/create-item'
import { HelmetsDefenseByResourceType } from '../config-type'

export default createItem(95, 'helmet')
  .sources('DIVING_SUIT', 'DIVING_SUIT')
  .name('Diving Suit')
  .wearable()
  .wearableEffect({
    inWaterTempLoss: {
      day: -70,
      night: -70,
    },
    oxygenLoss: -27,
    inWaterSpeed: 40,
  })
  .craftable({
    duration: 20,
    givesXp: 2500,
    state: { workbench: true, fire: true },
    required: {
      23: 30,
      49: 10,
      50: 1,
      87: 1,
    },
  })
  .defense(...HelmetsDefenseByResourceType.gold)
  .build()
