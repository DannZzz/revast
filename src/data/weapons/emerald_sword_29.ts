import createItem from 'src/structures/item-creator/create-item'

export default createItem(29, 'weapon')
  .sources('EMERALD_SWORD', 'ICON_EMERALD_SWORD')
  .equipableDefault()
  .name('Emerald Sword')
  .setItemResourceType('emerald')
  .setVariant('sword')
  .craftable({
    state: { workbench: true },
    required: {
      23: 50,
      22: 60,
      21: 80,
      28: 1,
    },
  })
  .data({
    damage: 30,
    damageBuilding: 20,
  })
  .build()
