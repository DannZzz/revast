import createItem from 'src/structures/item-creator/create-item'

export default createItem(73, 'tool')
  .equipableDefault()
  .setEquipmentItemSize('hammers')
  .sources('AMETHYST_HAMMER', 'ICON_AMETHYST_HAMMER')
  .setItemResourceType('amethyst')
  .setVariant('hammer')
  .data({
    damage: 5,
    damageBuilding: 60,
  })
  .craftable({
    state: { workbench: true },
    required: {
      21: 60,
      20: 120,
      19: 160,
      72: 1,
    },
  })
  .build()
