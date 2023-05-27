import createItem from 'src/structures/item-creator/create-item'

export default createItem(11, 'tool')
  .sources('DIAMOND_AXE', 'ICON_DIAMOND_AXE')
  .setVariant('axe')
  .name('Diamond Axe')
  .equipableDefault()
  .setItemResourceType('diamond')
  .data({
    damage: 2,
    flip: true,
    startRotationWith: 45,
    resourceGettingPower: {
      wood: 4,
      stone: 3,
      gold: 2,
      diamond: 1,
    },
  })
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      20: 20,
      19: 40,
      5: 60,
      10: 1,
    },
  })
  .build()
