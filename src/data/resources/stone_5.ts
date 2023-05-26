import createItem from 'src/structures/item-creator/create-item'

export default createItem(5)
  .iconSource('ICON_STONE')
  .name('Stone')
  .data({
    resourceType: 'stone',
  })
  .build()
