import createItem from 'src/structures/item-creator/create-item'

export default createItem(116)
  .iconSource('BREAD')
  .name('Bread')
  .data({
    toFood: 20,
    toHealth: 0,
    toWater: 0,
  })
  .craftable({
    givesXp: 100,
    duration: 4,
    state: { fire: true },
    required: {
      115: 3,
    },
  })
  .build()
