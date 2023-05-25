import createItem from 'src/structures/item-creator/create-item'

export default createItem(21)
  .iconSource('ICON_AMETHYST')
  .name('Amethyst')
  .data({ resourceType: 'amethyst' })
  .build()
