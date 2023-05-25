import createItem from 'src/structures/item-creator/create-item'

export default createItem(33, 'weapon')
  .equipableDefault()
  .setVariant('spear')
  .setEquipmentItemSize('spears')
  .setItemResourceType('stone')
  .iconSource('ICON_STONE_SPEAR')
  .source('STONE_SPEAR')
  .name('Stone Spear')
  .data({
    damage: 13,
  })
  .craftable({
    state: { workbench: true },
    required: {
      5: 15,
      3: 60,
    },
  })
  .build()
