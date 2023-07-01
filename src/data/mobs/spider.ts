import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.spider)
  .givesXP(150)
  .hp(200)
  .damage(30, 1)
  .radius(300, 70)
  .size(150, 150)
  .speed(110)
  .sources('SPIDER', 'HURT_SPIDER')
  .drop({
    42: 4,
  })
  .idleTactic({
    duration: 0.5,
    interval: () => $.randomNumber(1500, 3000) / 1000,
  })
  .defaultAttackTactic()
  .build()
