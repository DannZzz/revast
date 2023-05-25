import createItem from 'src/structures/item-creator/create-item'

export default createItem(10, 'tool')
  .sources('GOLDEN_AXE', 'ICON_GOLDEN_AXE')
  .equipableDefault()
  .setItemResourceType('gold')
  .name('Golden Axe')
  .setVariant('axe')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      19: 20,
      5: 30,
      4: 1,
    },
  })
  .data({
    startRotationWith: 45,
    resourceGettingPower: {
      wood: 3,
      stone: 2,
    },
    flip: true,
  })
  .build()
