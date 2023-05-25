import createItem from 'src/structures/item-creator/create-item'

export default createItem(70, 'tool')
  .equipableDefault()
  .setEquipmentItemSize('hammers')
  .sources('STONE_HAMMER', 'ICON_STONE_HAMMER')
  .setItemResourceType('stone')
  .setVariant('hammer')
  .data({
    damage: 1,
    damageBuilding: 30,
  })
  .craftable({
    state: { workbench: true },
    required: {
      5: 50,
      3: 100,
    },
  })
  .build()
