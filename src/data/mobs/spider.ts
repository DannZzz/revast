import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.spider)
  .givesXP(150)
  .hp(200)
  .damage(30, 1)
  .radius(300, 100)
  .size(150, 150)
  .speed(150)
  .sources('SPIDER', 'HURT_SPIDER')
  .hitbox({ radius: 50, type: 'circle' })
  .drop({
    42: 4,
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
