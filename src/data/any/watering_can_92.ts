import createItem from 'src/structures/item-creator/create-item'

export default createItem(92)
  .iconSource('WATERING_CAN')
  .name('Watering Can')
  .craftable({
    givesXp: 15,
    duration: 5,
    state: {
      workbench: true,
    },
    required: {
      3: 50,
    },
  })
  .build()
