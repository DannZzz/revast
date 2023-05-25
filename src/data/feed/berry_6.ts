import createItem from 'src/structures/item-creator/create-item'

export default createItem(6)
  .iconSource('ICON_BERRY')
  .name('Berry')
  .data({
    resourceType: 'berry',
    toFood: 20,
    toHealth: 0,
  })
  .build()
