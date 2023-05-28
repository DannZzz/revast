import createItem from 'src/structures/item-creator/create-item'


export default createItem(18, 'tool')
  .sources('RUBY_PICKAXE', 'ICON_RUBY_PICKAXE')
  .equipableDefault()
  .setItemResourceType('ruby')
  .name('Ruby Pickaxe')
  .setVariant('pickaxe')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      22: 30,
      21: 40,
      20: 60,
      17: 1,
    },
  })
  .data({
    startRotationWith: 45,
    resourceGettingPower: {
      stone: 6,
      wood: 4,
      gold: 5,
      diamond: 4,
      amethyst: 3,
      ruby: 2,
      emerald: 1,
    },
    damage: 1,
    flip: true,
  })
  .build()
