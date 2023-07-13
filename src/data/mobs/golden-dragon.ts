import { MobMoveStatus } from 'src/game/basic/mob.basic'
import { createMob } from 'src/structures/item-creator/create-mob'
import { MobNames } from '../mobs'

export default createMob(MobNames.golden_dragon)
  .givesXP(20000)
  .hp(10000)
  .damage(100, 1)
  .damageBuilding(120, 0.6)
  .radius(500, 100)
  .size(500, 500)
  .onInit((gs) => {
    gs.alivePlayers.forEach((player) =>
      player.serverMessage('Golden Dragon has arrived!'),
    )
  })
  .onRemove((gs, player) => {
    gs.mobs.addTimes.GOLDEN_DRAGON =
      Date.now() + gs.mobs.config.GOLDEN_DRAGON.reAddEachSeconds * 1000
    gs.alivePlayers.forEach((pl) =>
      pl.serverMessage(`Golden Dragon was defeated by ${player.name}!`),
    )
  })
  .speed(100)
  .sources('GOLDEN_DRAGON', 'HURT_GOLDEN_DRAGON')
  .drop(() => {
    const percent = $.randomNumber(0, 100)
    return {
      30: 30,
      [percent > 50 ? 111 : 119]: 1,
    }
  })
  .idleTactic({
    duration: 0.5,
    interval: () => $.randomNumber(1500, 3000) / 1000,
  })
  .defaultAttackTactic()
  .build()
