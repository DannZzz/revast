import createItem from 'src/structures/item-creator/create-item'

export default createItem(15, 'tool')
  .sources('GOLDEN_PICKAXE', 'ICON_GOLDEN_PICKAXE')
  .equipableDefault()
  .setItemResourceType('gold')
  .setVariant('pickaxe')
  .name('Golden Pickaxe')
  .craftable({
    state: { workbench: true },
    required: {
      19: 20,
      5: 30,
      14: 1,
    },
  })
  .data({
    startRotationWith: 45,
    resourceGettingPower: {
      stone: 3,
      gold: 2,
      diamond: 1,
      wood: 2,
    },
    flip: true,
  })
  .build()
