import createItem from 'src/structures/item-creator/create-item'

export default createItem(44, 'tool', 'bag')
  .name('Bag')
  .craftable({
    duration: 5,
    givesXp: 300,
    state: { workbench: true },
    required: {
      32: 5,
      42: 6,
    },
  })
  .data({
    notAddable: true,
    maxAmount: 1,
  })
  .sources('BAG', 'ICON_BAG')
  .build()
