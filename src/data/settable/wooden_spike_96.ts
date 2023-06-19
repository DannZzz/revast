import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(96)
  .itIsSpike('wood', false)
  .name('Wooden Spike')
  .sources('WOODEN_SPIKE', 'WOODEN_SPIKE')
  .craftable({
    state: { workbench: true },
    required: {
      5: 30,
      39: 1,
    },
  })
  .build()
