import createItem from 'src/structures/item-creator/create-item'

export default createItem(35, 'weapon')
  .equipableDefault()
  .setVariant('spear')
  .name('Diamond Spear')
  .setEquipmentItemSize('spears')
  .setItemResourceType('diamond')
  .iconSource('ICON_DIAMOND_SPEAR')
  .source('DIAMOND_SPEAR')
  .data({
    damage: 17,
  })
  .craftable({
    state: { workbench: true },
    required: {
      20: 40,
      19: 60,
      3: 200,
      34: 1,
    },
  })
  .build()
