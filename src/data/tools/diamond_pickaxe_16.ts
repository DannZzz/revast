import createItem from 'src/structures/item-creator/create-item'

export default createItem(16, 'tool')
  .sources('DIAMOND_PICKAXE', 'ICON_DIAMOND_PICKAXE')
  .equipableDefault()
  .name('Diamond Pickaxe')
  .setVariant('pickaxe')
  .setItemResourceType('diamond')
  .craftable({
    state: { workbench: true },
    required: {
      20: 20,
      19: 40,
      5: 60,
      15: 1,
    },
  })
  .data({
    startRotationWith: 45,
    resourceGettingPower: {
      stone: 4,
      wood: 3,
      gold: 3,
      diamond: 2,
      amethyst: 1,
    },
    damage: 2,
    flip: true,
  })
  .build()
