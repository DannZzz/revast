import createItem from 'src/structures/item-creator/create-item'

export default createItem(122, 'helmet')
  .sources('DRAGON_HELMET', 'ICON_DRAGON_HELMET')
  .name('Dragon Helmet')
  .setItemResourceType('dragon')
  .wearable()
  .craftable({
    state: { workbench: true, fire: true },
    required: {
      51: 3,
      111: 1,
      58: 1,
    },
  })
  .build()
