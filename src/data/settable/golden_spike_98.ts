import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(98)
  .itIsSpike('gold', false)
  .name('Golden Spike')
  .sources('GOLDEN_SPIKE', 'ICON_GOLDEN_SPIKE')
  .craftable({
    state: { workbench: true },
    required: {
      5: 40,
      19: 40,
      61: 1,
    },
  })
  .build()
