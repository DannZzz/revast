import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(65)
  .itIsWall('amethyst')
  .name('Amethyst Wall')
  .sources('AMETHYST_WALL', 'AMETHYST_WALL')
  .craftable({
    state: { workbench: true },
    required: {
      21: 20,
      63: 1,
    },
  })
  .build()
