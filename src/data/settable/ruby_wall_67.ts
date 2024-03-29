import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(67)
  .itIsWall('ruby')
  .name('Ruby Wall')
  .sources('RUBY_WALL', 'ICON_RUBY_WALL')
  .craftable({
    state: { workbench: true },
    required: {
      22: 8,
      65: 1,
    },
  })
  .build()
