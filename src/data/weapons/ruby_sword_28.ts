import createItem from 'src/structures/item-creator/create-item'

export default createItem(28, 'weapon')
  .sources('RUBY_SWORD', 'ICON_RUBY_SWORD')
  .equipableDefault()
  .setItemResourceType('ruby')
  .setVariant('sword')
  .name('Ruby Sword')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      22: 40,
      21: 50,
      20: 70,
      27: 1,
    },
  })
  .data({
    damage: 28,
  })
  .build()
