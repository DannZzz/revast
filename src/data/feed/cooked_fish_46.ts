import createItem from 'src/structures/item-creator/create-item'

export default createItem(46)
  .iconSource('COOKED_FISH')
  .name('Cooked Fish')
  .craftable({
    duration: 3,
    givesXp: 30,
    required: {
      45: 1,
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
