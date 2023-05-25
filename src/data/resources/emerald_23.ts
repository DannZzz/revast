import createItem from 'src/structures/item-creator/create-item'

export default createItem(23)
  .iconSource('ICON_EMERALD')
  .name('Emerald')
  .data({
    resourceType: 'emerald',
  })
  .build()
