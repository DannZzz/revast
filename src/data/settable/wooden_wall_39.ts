import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(39)
  .itIsWall('wood')
  .name('Wooden Wall')
  .sources('WOODEN_WALL', 'ICON_WOODEN_WALL')
  .craftable({
    state: { workbench: true },
    required: {
      3: 20,
    },
  })
  .build()
