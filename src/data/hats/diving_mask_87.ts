import createItem from 'src/structures/item-creator/create-item'

export default createItem(87, 'hat')
  .sources('DIVING_MASK', 'DIVING_MASK')
  .name('Diving Mask')
  .wearable()
  .wearableEffect({
    oxygenLoss: -15,
    inWaterSpeed: 30,
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
  .build()
