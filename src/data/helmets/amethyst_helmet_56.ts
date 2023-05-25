import createItem from 'src/structures/item-creator/create-item'

export default createItem(56, 'helmet')
  .sources('AMETHYST_HELMET', 'ICON_AMETHYST_HELMET')
  .name('Amethyst Helmet')
  .setItemResourceType('amethyst')
  .wearable()
  .craftable({
    state: { workbench: true },
    required: {
      21: 80,
      20: 100,
      19: 150,
      55: 1,
    },
  })
  .build()
