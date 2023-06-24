import createItem from 'src/structures/item-creator/create-item'

export default createItem(108)
  .iconSource('BANDAGE')
  .name('Bandage')
  .data({
    toFood: 0,
    toHealth: 0,
    toWater: 0,
    custom(player) {
      player.bars.bandageEffect.value += 5
      player.bars.socketUpdate()
    },
  })
  .craftable({
    duration: 5,
    givesXp: 200,
    state: { workbench: true },
    required: {
      42: 2,
    },
  })
  .build() //
