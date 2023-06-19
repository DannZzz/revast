import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(100)
  .itIsSpike('amethyst', false)
  .name('Amethyst Spike')
  .sources('AMETHYST_SPIKE', 'AMETHYST_SPIKE')
  .craftable({
    state: { workbench: true },
    required: {
      21: 30,
      19: 40,
      65: 1,
    },
  })
  .build()
