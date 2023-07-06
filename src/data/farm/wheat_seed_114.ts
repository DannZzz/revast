import { GAME_DAY_SECONDS } from 'src/constant'
import { Point, Size } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(114)
  .sources('PRE_WHEAT', 'ICON_WHEAT_SEEDS')
  .cover(-2)
  .name('Wheat Seeds')
  .size(100, 100)
  .hp(850)
  .setMode(new Point(0, -100), { type: 'circle', radius: 45 })
  .craftable({
    givesXp: 30,
    duration: 5,
    state: { fire: true },
    required: {
      113: 3,
    },
  })
  .mode(
    {
      cover: -2,
      trigger: 'custom',
      verify: () => true,
      source: 'WHEAT',
      size: new Size(114, 143),
    },
    {
      cover: -2,
      trigger: 'custom',
      verify: () => true,
      source: 'DEHYDRATED_WHEAT',
      size: new Size(114, 143),
    },
    {
      cover: -2,
      trigger: 'custom',
      verify: () => true,
      source: 'PRE_DEHYDRATED_WHEAT',
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
    growthTime: 5,
    dehydrateTime: 10 * 60,
    resourceInterval: 8,
    maxResource: 1,
    resourceId: 113,
  })
  .onDraw(function () {
    this.theta = 0
    this.rotation = 0
  })
  .buildSeed()
