import createItem from 'src/structures/item-creator/create-item'
import { SpecialItemTypes } from '../config-type'
import { Size } from 'src/global/global'

export default createItem(111, 'tool', SpecialItemTypes.pitchfork)
  .sources('PITCHFORK', 'ICON_PITCHFORK')
  .equipableDefault()
  .name('Pitchfork')
  .setVariant('pitchfork')
  .craftable({
    state: { workbench: true },
    givesXp: 200,
    duration: 8,
    required: {
      5: 50,
      3: 90,
    },
  })
  .data({
    size: new Size(300, 300),
  })
  .build()
