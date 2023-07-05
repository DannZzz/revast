import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(59)
  .itIsWall('stone')
  .name('Stone Wall')
  .sources('STONE_WALL', 'ICON_STONE_WALL')
  .craftable({
    state: { workbench: true },
    required: {
      5: 17,
      39: 1,
    },
  })
  .build()
