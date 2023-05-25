import createItem from 'src/structures/item-creator/create-item'
import { Item } from '../../game/basic/item.basic'
import { Images } from '../../structures/image-base'
import {
  CraftGivingXP,
  CraftDuration,
  DrawPosByType,
  RangeByType,
} from '../config-type'

export default createItem(18, 'tool')
  .sources('RUBY_PICKAXE', 'ICON_RUBY_PICKAXE')
  .equipableDefault()
  .setItemResourceType('ruby')
  .name('Ruby Pickaxe')
  .setVariant('pickaxe')
  .craftable({
    state: {
      workbench: true,
    },
    required: {
      22: 30,
      21: 40,
      20: 60,
      17: 1,
    },
  })
  .data({
    startRotationWith: 45,
    resourceGettingPower: {
      stone: 6,
      wood: 4,
    },
    damage: 1,
    flip: true,
  })
  .build()
