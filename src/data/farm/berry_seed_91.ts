import { GAME_DAY_SECONDS } from 'src/constant'
import { Point } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(91, 'berry-seed')
  .sources('PRE_BERRY_BUSH', 'ICON_BERRY_SEEDS')
  .cover(-2)
  .name('Berry Seeds')
  .size(100, 100)
  .hp(850)
  .setMode(new Point(0, -100), { type: 'circle', radius: 35 })
  .craftable({
    givesXp: 30,
    duration: 5,
    state: { fire: true },
    required: {
      6: 3,
    },
  })
  .mode(
    {
      cover: -2,
      trigger: 'custom',
      verify: () => true,
      source: 'BERRY_BUSH',
    },
    {
      cover: -2,
      trigger: 'custom',
      verify: () => true,
      source: 'DEHYDRATED_BERRY_BUSH',
    },
  )
  .noAttackedAnimation()
  .duration(6 * GAME_DAY_SECONDS)
  .seed({
    configureMode: {
      dehydrated: 2,
      dehydratedEmpty: 2,
      grown: 1,
      empty: 1,
    },
    growthTime: 7,
    dehydrateTime: 15 * 60,
    resourceInterval: 10,
    maxResource: 3,
    resourceId: 6,
  })
  .buildSeed()
