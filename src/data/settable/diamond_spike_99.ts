import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(99)
  .itIsSpike('diamond', false)
  .name('Diamond Spike')
  .sources('DIAMOND_SPIKE', 'DIAMOND_SPIKE')
  .craftable({
    state: { workbench: true },
    required: {
      5: 40,
      20: 35,
      63: 1,
    },
  })
  .build()
