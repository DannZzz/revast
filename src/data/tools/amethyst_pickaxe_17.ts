import createItem from 'src/structures/item-creator/create-item'

export default createItem(17, 'tool')
  .sources('AMETHYST_PICKAXE', 'ICON_AMETHYST_PICKAXE')
  .setItemResourceType('amethyst')
  .name('Amethyst Pickaxe')
  .setVariant('pickaxe')
  .equipableDefault()
  .craftable({
    required: {
      21: 30,
      20: 40,
      19: 60,
      16: 1,
    },
    state: {
      workbench: true,
    },
  })
  .data({
    startRotationWith: 45,
    resourceGettingPower: {
      stone: 5,
      wood: 3,
      gold: 4,
      diamond: 3,
      amethyst: 2,
      ruby: 1,
    },
    damage: 1,
    flip: true,
  })
  .build()
