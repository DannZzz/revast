import createItem from 'src/structures/item-creator/create-item'

export default createItem(72, 'tool')
  .equipableDefault()
  .setEquipmentItemSize('hammers')
  .sources('DIAMOND_HAMMER', 'ICON_DIAMOND_HAMMER')
  .setItemResourceType('diamond')
  .setVariant('hammer')
  .data({
    damage: 3,
    damageBuilding: 50,
  })
  .craftable({
    state: { workbench: true },
    required: {
      20: 80,
      19: 120,
      5: 160,
      71: 1,
    },
  })
  .build()
