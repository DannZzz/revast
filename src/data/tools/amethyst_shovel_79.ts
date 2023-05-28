import createItem from 'src/structures/item-creator/create-item'

export default createItem(79, 'tool')
  .sources('AMETHYST_SHOVEL', 'ICON_AMETHYST_SHOVEL')
  .equipableDefault()
  .setItemResourceType('amethyst')
  .name('Amethyst Shovel')
  .setVariant('shovel')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      21: 30,
      20: 40,
      19: 60,
      78: 1,
    },
  })
  .data({
    damage: 1,
    digPower: 4,
  })
  .build()
