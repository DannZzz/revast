import createItem from 'src/structures/item-creator/create-item'

export default createItem(19)
  .iconSource('ICON_STONE')
  .name('Stone')
  .data({
    resourceType: 'stone',
  })
  .build()
