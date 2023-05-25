import createItem from 'src/structures/item-creator/create-item'

export default createItem(22)
  .iconSource('ICON_RUBY')
  .name('Ruby')
  .data({
    resourceType: 'ruby',
  })
  .build()
