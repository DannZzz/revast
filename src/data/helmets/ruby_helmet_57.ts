import createItem from 'src/structures/item-creator/create-item'

export default createItem(57, 'helmet')
  .sources('RUBY_HELMET', 'ICON_RUBY_HELMET')
  .name('Ruby Helmet')
  .setItemResourceType('ruby')
  .wearable()
  .craftable({
    state: { workbench: true },
    required: {
      22: 70,
      21: 80,
      20: 120,
      56: 1,
    },
  })
  .build()
