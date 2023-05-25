import createItem from 'src/structures/item-creator/create-item'

export default createItem(54, 'helmet')
  .sources('GOLDEN_HELMET', 'ICON_GOLDEN_HELMET')
  .name('Golden Helmet')
  .setItemResourceType('gold')
  .wearable()
  .craftable({
    state: { workbench: true },
    required: {
      19: 80,
      5: 90,
      3: 100,
      53: 1,
    },
  })
  .build()
