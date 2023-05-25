import createItem from 'src/structures/item-creator/create-item'

export default createItem(41)
  .name('Paper')
  .craftable({
    givesXp: 20,
    duration: 4,
    required: {
      3: 20,
    },
    state: { workbench: true },
  })
  .iconSource('PAPER')
  .build()
