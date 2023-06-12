import createItem from 'src/structures/item-creator/create-item'

export default createItem(95, 'hat')
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
      10: 49,
      50: 1,
      87: 1,
    },
  })
  .build()
