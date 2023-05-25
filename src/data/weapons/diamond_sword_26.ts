import createItem from 'src/structures/item-creator/create-item'

export default createItem(26, 'weapon')
  .sources('DIAMOND_SWORD', 'ICON_DIAMOND_SWORD')
  .equipableDefault()
  .name('Diamond Sword')
  .setItemResourceType('diamond')
  .setVariant('sword')
  .craftable({
    state: { workbench: true },
    required: {
      20: 40,
      19: 60,
      5: 60,
      25: 1,
    },
  })
  .data({
    damage: 24,
  })
  .build()
