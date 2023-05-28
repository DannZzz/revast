import createItem from 'src/structures/item-creator/create-item'

export default createItem(31)
  .iconSource('COOKED_MEAT')
  .name('Cooked Meat')
  .craftable({
    duration: 4,
    givesXp: 30,
    required: {
      30: 1,
    },
    state: {
      fire: true,
    },
  })
  .data({
    toFood: 40,
    toHealth: 0,
    toWater: 0,
  })
  .build()
