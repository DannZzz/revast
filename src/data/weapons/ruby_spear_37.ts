import createItem from 'src/structures/item-creator/create-item'

export default createItem(37, 'weapon')
  .equipableDefault()
  .setVariant('spear')
  .setEquipmentItemSize('spears')
  .setItemResourceType('ruby')
  .iconSource('ICON_RUBY_SPEAR')
  .source('RUBY_SPEAR')
  .name('Ruby Spear')
  .data({
    damage: 22,
  })
  .craftable({
    state: { workbench: true },
    required: {
      22: 40,
      21: 50,
      20: 90,
      36: 1,
    },
  })
  .build()
