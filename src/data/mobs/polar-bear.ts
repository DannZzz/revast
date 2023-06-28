import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.polar_bear)
  .givesXP(150)
  .hp(550)
  .damage(45, 1)
  .radius(300, 90)
  .size(200, 200)
  .speed(85)
  .sources('POLAR_BEAR', 'HURT_POLAR_BEAR')
  .drop({
    47: 3,
    30: 4,
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
