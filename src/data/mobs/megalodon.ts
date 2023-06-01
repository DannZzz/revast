import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.megalodon)
  .givesXP(150)
  .hp(5000)
  .damage(60, 1)
  .radius(300, 100)
  .size(250, 250)
  .speed(130)
  .sources('MEGALODON', 'HURT_MEGALODON')
  .hitbox(100)
  .drop({
    50: 1,
    45: 10,
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
