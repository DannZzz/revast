import createItem from 'src/structures/item-creator/create-item'

export default createItem(38, 'weapon')
  .equipableDefault()
  .setVariant('spear')
  .name('Emerald Spear')
  .setEquipmentItemSize('spears')
  .setItemResourceType('emerald')
  .iconSource('ICON_EMERALD_SPEAR')
  .source('EMERALD_SPEAR')
  .data({
    damage: 24,
  })
  .craftable({
    state: { workbench: true },
    required: {
      23: 60,
      22: 60,
      21: 120,
      37: 1,
    },
  })
  .build()
