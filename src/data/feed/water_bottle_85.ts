import createItem from 'src/structures/item-creator/create-item'

export default createItem(85)
  .iconSource('WATER_BOTTLE')
  .name('Water Bottle')
  .data({
    toFood: 0,
    toHealth: 0,
    toWater: 50,
    giveAfterEat: 84
  })
  .extraCraftable(
    {
      givesXp: 0,
      duration: 2,
      state: {
        water: true,
      },
      required: {
        84: 1,
      },
    },
    {
      givesXp: 0,
      duration: 3,
      state: {
        fire: true,
      },
      required: {
        82: 20,
        84: 1,
      },
    },
  )
  .build()
