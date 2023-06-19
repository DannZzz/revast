import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(97)
  .itIsSpike('stone', false)
  .name('Stone Spike')
  .sources('STONE_SPIKE', 'STONE_SPIKE')
  .craftable({
    state: { workbench: true },
    required: {
      5: 70,
      59: 1,
    },
  })
  .build()
