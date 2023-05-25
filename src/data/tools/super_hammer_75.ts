import createItem from 'src/structures/item-creator/create-item'

export default createItem(75, 'tool')
  .equipableDefault()
  .setEquipmentItemSize('hammers')
  .sources('SUPER_HAMMER', 'ICON_SUPER_HAMMER')
  .setItemResourceType('emerald')
  .setVariant('hammer')
  .data({
    damage: 12,
    damageBuilding: 80,
  })
  .craftable({
    state: { workbench: true, fire: true },
    required: {
      50: 1,
      49: 10,
      23: 60,
      74: 1,
    },
  })
  .build()
