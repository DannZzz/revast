import { POINT_MACHINE_XP_PER_5_SECONDS } from 'src/constant'
import { Point } from 'src/global/global'
import createSettable from 'src/structures/item-creator/create-settable'

export default createSettable(109, 'point-machine')
  .hp(1750)
  .name('Point Machine')
  .size(192, 192)
  .setMode(new Point(0, -96), {
    type: 'circle',
    radius: 45,
  })
  .craftable({
    givesXp: 2500,
    duration: 20,
    state: { workbench: true },
    required: { 21: 150, 52: 1 },
  })
  .data({
    showHpRadius: 40,
  })
  .max(1)
  .loop((settable) => {
    const author = settable.players.get(settable.authorId)
    if (settable.timeouts.pointMachine > Date.now()) return
    author?.lbMember.add(POINT_MACHINE_XP_PER_5_SECONDS)
    settable.timeouts.pointMachine = Date.now() + 5000
  })
  .onDestroy((settable) => {
    const author = settable.players.get(settable.authorId)
    author?.die()
  })
  .sources('POINT_MACHINE', 'ICON_POINT_MACHINE')
  .build()
