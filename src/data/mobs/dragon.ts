import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.dragon)
  .givesXP(150)
  .hp(5000)
  .damage(65, 1)
  .radius(300, 100)
  .size(300, 300)
  .speed(115)
  .sources('DRAGON', 'HURT_DRAGON')
  .drop({
    51: 1,
    30: 15,
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
