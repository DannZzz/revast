import createItem from 'src/structures/item-creator/create-item'

export default createItem(6)
  .iconSource('ICON_BERRY')
  .name('Berry')
  .data({
    resourceType: 'berry',
    toFood: 10,
    toHealth: 0,
    toWater: 0,
  })
  .build()
