import createItem from 'src/structures/item-creator/create-item'

export default createItem(3)
  .iconSource('ICON_WOOD')
  .name('Wood')
  .data({
    resourceType: 'wood',
  })
  .build()
