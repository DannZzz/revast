import createItem from 'src/structures/item-creator/create-item'

export default createItem(34, 'weapon')
  .equipableDefault()
  .setVariant('spear')
  .setEquipmentItemSize('spears')
  .setItemResourceType('gold')
  .iconSource('ICON_GOLDEN_SPEAR')
  .source('GOLDEN_SPEAR')
  .name('Golden Spear')
  .data({
    damage: 15,
  })
  .craftable({
    state: { workbench: true },
    required: {
      19: 30,
      5: 30,
      3: 70,
      33: 1,
    },
  })
  .build()
