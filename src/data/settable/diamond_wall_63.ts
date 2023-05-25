import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(63)
  .itIsWall('diamond')
  .name('Diamond Wall')
  .sources('DIAMOND_WALL', 'DIAMOND_WALL')
  .craftable({
    state: { workbench: true },
    required: {
      20: 20,
      61: 1,
    },
  })
  .build()
