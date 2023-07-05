import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(63)
  .itIsWall('diamond')
  .name('Diamond Wall')
  .sources('DIAMOND_WALL', 'ICON_DIAMOND_WALL')
  .craftable({
    state: { workbench: true },
    required: {
      20: 12,
      61: 1,
    },
  })
  .build()
