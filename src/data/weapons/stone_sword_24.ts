import createItem from 'src/structures/item-creator/create-item'

export default createItem(24, 'weapon')
  .equipableDefault()
  .setItemResourceType('stone')
  .setVariant('sword')
  .name('Stone Sword')
  .sources('STONE_SWORD', 'ICON_STONE_SWORD')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      5: 25,
      3: 50,
    },
  })
  .data({
    damage: 18,
  })
  .build()
