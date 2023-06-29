import createItem from 'src/structures/item-creator/create-item'

export default createItem(110, 'hat')
  .sources('CAP_SCARF', 'CAP_SCARF')
  .name('Cap Scarf')
  .wearable()
  .wearableEffect({
    tempLossPerc: {
      day: -70,
      night: -70,
    },
    heatPerc: {
      day: 35,
      night: 35,
    },
  })
  .luck('gold')
  .craftable({
    duration: 14,
    givesXp: 2000,
    state: { workbench: true },
    required: {
      47: 10,
      42: 5,
      94: 1,
    },
  })
  .build()
