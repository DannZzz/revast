import createItem from 'src/structures/item-creator/create-item'

export default createItem(2, 'tool')
  .sources('WOODEN_PICKAXE', 'ICON_WOODEN_PICKAXE')
  .equipableDefault()
  .name('Wooden Pickaxe')
  .setItemResourceType('wood')
  .setVariant('pickaxe')
  .craftable({
    required: {
      3: 10,
    },
  })
  .data({
    startRotationWith: 45,
    resourceGettingPower: {
      stone: 1,
      wood: 1,
    },
    flip: true,
    damage: 1,
  })
  .build()
