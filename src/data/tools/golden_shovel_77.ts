import createItem from 'src/structures/item-creator/create-item'

export default createItem(77, 'tool')
  .sources('GOLDEN_SHOVEL', 'ICON_GOLDEN_SHOVEL')
  .equipableDefault()
  .setItemResourceType('gold')
  .name('Golden Shovel')
  .setVariant('shovel')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      19: 20,
      5: 30,
      3: 40,
      76: 1,
    },
  })
  .data({
    damage: 1,
    digPower: 2,
  })
  .build()
