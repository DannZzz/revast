import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.scorpion)
  .givesXP(5000)
  .hp(3000)
  .damage(65, 1)
  .damageBuilding(90, 0.6)
  .radius(300, 90)
  .size(250, 250)
  .speed(120)
  .sources('SCORPION', 'HURT_SCORPION')
  .drop({
    52: 1,
    30: 15,
  })
  .idleTactic({
    duration: 0.5,
    interval: () => $.randomNumber(1500, 3000) / 1000,
  })
  .defaultAttackTactic()
  .build()
