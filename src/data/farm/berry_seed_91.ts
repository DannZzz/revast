import { GAME_DAY_SECONDS } from 'src/constant'
import { Point } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(91)
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
      source: 'BERRY_BUSH_FULL',
    },
    {
      cover: -2,
      trigger: 'custom',
      verify: () => true,
      source: 'DEHYDRATED_BERRY_BUSH',
    },
    {
      cover: -2,
      trigger: 'custom',
      verify: () => true,
      source: 'PRE_DEHYDRATED_BERRY_BUSH',
    },
  )
  .noAttackedAnimation()
  .duration(6 * GAME_DAY_SECONDS)
  .seed({
    configureMode: {
      dehydrated: 2,
      dehydratedEmpty: 3,
      grown: 1,
      empty: 0,
    },
    growthTime: 7 * 60,
    dehydrateTime: 15 * 60,
    resourceInterval: 30,
    maxResource: 1,
    resourceId: 6,
    resourceAtOnce: 3,
  })
  .buildSeed()
