import createItem from 'src/structures/item-creator/create-item'

export default createItem(80, 'tool')
  .sources('RUBY_SHOVEL', 'ICON_RUBY_SHOVEL')
  .equipableDefault()
  .setItemResourceType('ruby')
  .name('Ruby Shovel')
  .setVariant('shovel')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      22: 30,
      21: 60,
      20: 60,
      79: 1,
    },
  })
  .data({
    damage: 1,
    digPower: 5,
  })
  .build()
