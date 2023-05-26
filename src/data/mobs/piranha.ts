import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.piranha)
  .givesXP(150)
  .hp(250)
  .damage(30, 1)
  .radius(300, 70)
  .size(150, 150)
  .speed(110)
  .sources('PIRANHA', 'HURT_PIRANHA')
  .hitbox(50)
  .drop({
    49: 2,
    45: 3,
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
