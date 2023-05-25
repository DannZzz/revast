import createItem from 'src/structures/item-creator/create-item'

export default createItem(12, 'tool')
  .setVariant('axe')
  .name('Amethyst Axe')
  .setItemResourceType('amethyst')
  .equipableDefault()
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      21: 30,
      20: 40,
      19: 60,
      11: 1,
    },
  })
  .source('AMETHYST_AXE')
  .iconSource('ICON_AMETHYST_AXE')
  .data({
    damage: 2,
    flip: true,
    startRotationWith: 45,
    resourceGettingPower: {
      wood: 5,
      stone: 3,
    },
  })
  .build()
