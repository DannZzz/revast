import createItem from 'src/structures/item-creator/create-item'

export default createItem(27, 'weapon')
  .setVariant('sword')
  .setItemResourceType('amethyst')
  .name('Amethyst Sword')
  .equipableDefault()
  .craftable({
    state: { workbench: true },
    required: {
      21: 40,
      20: 60,
      19: 90,
      26: 1,
    },
  })
  .sources('AMETHYST_SWORD', 'ICON_AMETHYST_SWORD')
  .data({
    damage: 26,
  })
  .build()
