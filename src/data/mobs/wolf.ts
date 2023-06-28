import { MobMoveStatus } from '../../game/basic/mob.basic'
import { MobNames } from '../mobs'
import { createMob } from 'src/structures/item-creator/create-mob'

export default createMob(MobNames.wolf)
  .givesXP(150)
  .hp(300)
  .damage(30, 1)
  .radius(300, 70)
  .size(150, 150)
  .speed(105)
  .sources('WOLF', 'HURT_WOLF')
  .drop({
    32: 2,
    30: 3,
  })
  .idleTactic({
    duration: 0.5,
    interval: () => $.randomNumber(1500, 3000) / 1000,
  })
  .tactic({
    type: MobMoveStatus.ATTACK,
    duration: 0,
    interval: 0,
  })
  .build()
