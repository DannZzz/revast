import createItem from 'src/structures/item-creator/create-item'

export default createItem(19)
  .iconSource('ICON_GOLD')
  .name('Gold')
  .data({
    resourceType: 'gold',
  })
  .build()
