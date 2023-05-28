import createItem from 'src/structures/item-creator/create-item'

export default createItem(30)
  .iconSource('MEAT')
  .name('Meat')
  .data({
    toFood: 15,
    toHealth: -10,
    toWater: 0,
  })
  .build()
