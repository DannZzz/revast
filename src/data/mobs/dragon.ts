import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.dragon)
  .givesXP(5000)
  .hp(3000)
  .damage(65, 1)
  .damageBuilding(90, 0.6)
  .radius(300, 100)
  .size(300, 300)
  .speed(110)
  .sources('DRAGON', 'HURT_DRAGON')
  .drop({
    51: 1,
    30: 15,
  })
  .idleTactic({
    duration: 0.5,
    interval: () => $.randomNumber(1500, 3000) / 1000,
  })
  .defaultAttackTactic()
  .build()
