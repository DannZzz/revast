import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(101)
  .itIsSpike('ruby', false)
  .name('Ruby Spike')
  .sources('RUBY_SPIKE', 'ICON_RUBY_SPIKE')
  .craftable({
    state: { workbench: true },
    required: {
      22: 30,
      5: 40,
      67: 1,
    },
  })
  .build()
