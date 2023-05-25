import createItem from 'src/structures/item-creator/create-item'

export default createItem(71, 'tool')
  .equipableDefault()
  .setEquipmentItemSize('hammers')
  .sources('GOLDEN_HAMMER', 'ICON_GOLDEN_HAMMER')
  .setItemResourceType('gold')
  .setVariant('hammer')
  .data({
    damage: 2,
    damageBuilding: 40,
  })
  .craftable({
    state: { workbench: true },
    required: {
      19: 80,
      5: 100,
      3: 200,
      70: 1,
    },
  })
  .build()
