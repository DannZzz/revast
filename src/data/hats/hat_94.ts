import createItem from 'src/structures/item-creator/create-item'

export default createItem(94, 'hat')
  .sources('HAT', 'HAT')
  .name('Hat')
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
    duration: 10,
    givesXp: 1000,
    state: { workbench: true },
    required: {
      32: 10,
      42: 10,
    },
  })
  .build()
