import createItem from 'src/structures/item-creator/create-item'

export default createItem(36, 'weapon')
  .equipableDefault()
  .setVariant('spear')
  .name('Amethyst Spear')
  .setEquipmentItemSize('spears')
  .setItemResourceType('amethyst')
  .iconSource('ICON_AMETHYST_SPEAR')
  .source('AMETHYST_SPEAR')
  .data({
    damage: 19,
  })
  .craftable({
    state: { workbench: true },
    required: {
      21: 40,
      20: 60,
      19: 120,
      35: 1,
    },
  })
  .build()
