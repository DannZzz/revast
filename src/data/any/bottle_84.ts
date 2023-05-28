import createItem from 'src/structures/item-creator/create-item'

export default createItem(84)
  .iconSource('BOTTLE')
  .name('Bottle')
  .craftable({
    givesXp: 15,
    duration: 5,
    state: {
      workbench: true,
      fire: true,
    },
    required: {
      83: 25,
    },
  })
  .build()
