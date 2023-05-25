import createItem from 'src/structures/item-creator/create-item'

export default createItem(13, 'tool')
  .sources('RUBY_AXE', 'ICON_RUBY_AXE')
  .setItemResourceType('ruby')
  .setVariant('axe')
  .equipableDefault()
  .name('Ruby Axe')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      22: 30,
      21: 40,
      20: 60,
      12: 1,
    },
  })
  .data({
    damage: 2,
    startRotationWith: 45,
    resourceGettingPower: {
      wood: 6,
      stone: 4,
    },
    flip: true,
  })
  .build()
