import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(61)
  .itIsWall('gold')
  .name('Golden Wall')
  .sources('GOLDEN_WALL', 'GOLDEN_WALL')
  .craftable({
    state: { workbench: true },
    required: {
      19: 15,
      59: 1,
    },
  })
  .build()
