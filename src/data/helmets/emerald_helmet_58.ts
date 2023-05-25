import createItem from 'src/structures/item-creator/create-item'

export default createItem(58, 'helmet')
  .sources('EMERALD_HELMET', 'ICON_EMERALD_HELMET')
  .name('Emerald Helmet')
  .setItemResourceType('emerald')
  .wearable()
  .craftable({
    state: { workbench: true },
    required: {
      23: 90,
      22: 100,
      21: 150,
      57: 1,
    },
  })
  .build()
