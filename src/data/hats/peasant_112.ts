import createItem from 'src/structures/item-creator/create-item'
import { SpecialItemTypes } from '../config-type'

export default createItem(112, 'hat', SpecialItemTypes.peasant)
  .sources('PEASANT', 'ICON_PEASANT')
  .name('Peasant')
  .wearable()
  .wearableEffect({
    tempLossPerc: {
      day: -50,
      night: -50,
    },
    heatPerc: {
      day: 20,
      night: 20,
    },
  })
  .craftable({
    duration: 8,
    givesXp: 800,
    state: { workbench: true },
    required: {
      48: 5,
      42: 6,
    },
  })
  .build()
