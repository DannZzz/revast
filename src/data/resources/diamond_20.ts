import createItem from 'src/structures/item-creator/create-item'

export default createItem(20)
  .iconSource('ICON_DIAMOND')
  .name("Diamond")
  .data({
    resourceType: "diamond"
  })
  .build()
