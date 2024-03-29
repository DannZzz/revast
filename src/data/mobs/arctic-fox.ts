import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.arctic_fox)
  .givesXP(150)
  .hp(300)
  .damage(30, 1)
  .radius(300, 70)
  .size(150, 150)
  .speed(90)
  .sources('ARCTIC_FOX', 'HURT_ARCTIC_FOX')
  .drop({
    47: 1,
    30: 3,
  })
  .idleTactic({
    duration: 0.5,
    interval: () => $.randomNumber(1500, 3000) / 1000,
  })
  .defaultAttackTactic()
  .build()
