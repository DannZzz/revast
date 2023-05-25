import createItem from 'src/structures/item-creator/create-item'

export default createItem(14, 'tool')
  .sources('STONE_PICKAXE', 'ICON_STONE_PICKAXE')
  .equipableDefault()
  .setVariant('pickaxe')
  .name('Stone Axe')
  .setItemResourceType('stone')
  .craftable({
    state: { workbench: true },
    required: {
      5: 15,
      3: 20,
      2: 1,
    },
  })
  .data({
    startRotationWith: 45,
    resourceGettingPower: {
      stone: 2,
      wood: 1,
    },
    damage: 1,
    flip: true,
  })
  .build()
