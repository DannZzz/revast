import createItem from 'src/structures/item-creator/create-item'

export default createItem(45)
  .iconSource('FISH')
  .name('Fish')
  .data({
    toFood: 15,
    toHealth: -10,
  })
  .build()
