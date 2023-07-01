import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(96)
  .itIsSpike('wood', false)
  .name('Wooden Spike')
  .sources('WOODEN_SPIKE', 'WOODEN_SPIKE')
  .craftable({
    state: { workbench: true },
    required: {
      3: 20,
      5: 15,
      39: 1,
    },
  })
  .build()
