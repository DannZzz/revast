import createItem from 'src/structures/item-creator/create-item'

export default createItem(53, 'helmet')
  .sources('STONE_HELMET', 'ICON_STONE_HELMET')
  .name('Stone Helmet')
  .setItemResourceType('stone')
  .wearable()
  .craftable({
    state: { workbench: true },
    required: {
      5: 65,
      3: 70,
    },
  })
  .build()
