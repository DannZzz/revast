import createItem from 'src/structures/item-creator/create-item'

export default createItem(74, 'tool')
  .equipableDefault()
  .setEquipmentItemSize('hammers')
  .sources('RUBY_HAMMER', 'ICON_RUBY_HAMMER')
  .setItemResourceType('ruby')
  .setVariant('hammer')
  .data({
    damage: 6,
    damageBuilding: 70,
  })
  .craftable({
    state: { workbench: true },
    required: {
      22: 60,
      21: 80,
      20: 150,
      19: 200,
      73: 1,
    },
  })
  .build()
