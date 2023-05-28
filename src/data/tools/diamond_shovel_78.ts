import createItem from 'src/structures/item-creator/create-item'

export default createItem(78, 'tool')
  .sources('DIAMOND_SHOVEL', 'ICON_DIAMOND_SHOVEL')
  .equipableDefault()
  .setItemResourceType('diamond')
  .name('Diamond Shovel')
  .setVariant('shovel')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      20: 20,
      19: 50,
      5: 60,
      77: 1,
    },
  })
  .data({
    damage: 1,
    digPower: 3,
  })
  .build()
