import createItem from 'src/structures/item-creator/create-item'

export default createItem(4, 'tool')
  .sources('STONE_AXE', 'ICON_STONE_AXE')
  .equipableDefault()
  .setItemResourceType('stone')
  .setVariant('pickaxe')
  .name("Stone Axe")
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      5: 15,
      3: 30,
    },
  })
  .data({
    damage: 2,
    startRotationWith: 45,
    resourceGettingPower: {
      wood: 1,
      stone: 2,
    },
    flip: true,
  })
  .build()
