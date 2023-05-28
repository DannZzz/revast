import createItem from 'src/structures/item-creator/create-item'

export default createItem(76, 'tool')
  .sources('STONE_SHOVEL', 'ICON_STONE_SHOVEL')
  .equipableDefault()
  .setItemResourceType('stone')
  .name('Stone Shovel')
  .setVariant('shovel')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      5: 20,
      3: 40,
    },
  })
  .data({
    damage: 1,
    digPower: 1,
  })
  .build()
