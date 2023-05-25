import createItem from 'src/structures/item-creator/create-item'

export default createItem(25, 'weapon')
  .sources('GOLDEN_SWORD', 'ICON_GOLDEN_SWORD')
  .equipableDefault()
  .setItemResourceType('gold')
  .setVariant('sword')
  .name("Golden Sword")
  .craftable({
    state: { workbench: true },
    required: {
      19: 40,
      5: 50,
      3: 60,
      24: 1,
    },
  })
  .data({
    damage: 22,
  })
  .build()
