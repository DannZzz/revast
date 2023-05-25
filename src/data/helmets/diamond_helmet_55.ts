import createItem from 'src/structures/item-creator/create-item'

export default createItem(55, 'helmet')
  .sources('DIAMOND_HELMET', 'ICON_DIAMOND_HELMET')
  .name('Diamond Helmet')
  .setItemResourceType('diamond')
  .wearable()
  .craftable({
    state: { workbench: true },
    required: {
      20: 100,
      19: 100,
      5: 100,
      54: 1,
    },
  })
  .build()
